import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'
import * as cors from 'cors'

// Initialize Firebase Admin
admin.initializeApp()

// Initialize CORS
const corsHandler = cors({ origin: true })

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user,
    pass: functions.config().email?.password
  }
})

// Contact form submission handler
export const submitContactForm = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const { type, name, email, phone, company, message, interests, preferredContact } = req.body

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Save to Firestore
      const submission = {
        type: type || 'individual',
        name,
        email,
        phone: phone || null,
        company: company || null,
        message,
        interests: interests || [],
        preferredContact: preferredContact || 'email',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'new',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }

      const docRef = await admin.firestore().collection('contactSubmissions').add(submission)

      // Send email notification
      const emailContent = `
        New contact form submission from ${name} (${email})
        
        Type: ${submission.type}
        ${company ? `Company: ${company}` : ''}
        ${phone ? `Phone: ${phone}` : ''}
        Preferred Contact: ${preferredContact}
        ${interests?.length ? `Interests: ${interests.join(', ')}` : ''}
        
        Message:
        ${message}
        
        Submission ID: ${docRef.id}
      `

      await emailTransporter.sendMail({
        from: functions.config().email?.user,
        to: functions.config().email?.recipient,
        subject: `New Contact Form Submission - ${type === 'organization' ? 'Organization' : 'Individual'}`,
        text: emailContent
      })

      // Send confirmation email to user
      const confirmationContent = `
        Hi ${name},
        
        Thank you for reaching out to Breathing Flame! We've received your message and will get back to you within 24 hours.
        
        In the meantime, feel free to explore our resources and take our assessments:
        - Ignite Your Flame Assessment: https://breathingflame.com/#ignite-your-flame
        - Peak Energy Profiler: https://breathingflame.com/#peak-energy-profiler
        
        Best regards,
        The Breathing Flame Team
      `

      await emailTransporter.sendMail({
        from: functions.config().email?.user,
        to: email,
        subject: 'Thank you for contacting Breathing Flame',
        text: confirmationContent
      })

      return res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully',
        id: docRef.id
      })

    } catch (error) {
      console.error('Contact form error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
})

// Newsletter signup handler
export const newsletterSignup = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const { email, interests, source } = req.body

      // Validate email
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' })
      }

      // Check if email already exists
      const existingSignup = await admin.firestore()
        .collection('newsletterSignups')
        .where('email', '==', email)
        .limit(1)
        .get()

      if (!existingSignup.empty) {
        return res.status(409).json({ error: 'Email already subscribed' })
      }

      // Save to Firestore
      const signup = {
        email,
        interests: interests || [],
        source: source || 'website',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'active',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }

      await admin.firestore().collection('newsletterSignups').add(signup)

      // Send welcome email
      const welcomeContent = `
        Welcome to Breathing Flame!
        
        Thank you for subscribing to our newsletter. You'll receive:
        - Weekly breathing exercises and mindfulness tips
        - Updates on new programs and experiences
        - Exclusive content and resources
        - Event invitations and early access
        
        To get started, take our free assessments:
        - Ignite Your Flame Assessment: https://breathingflame.com/#ignite-your-flame
        - Peak Energy Profiler: https://breathingflame.com/#peak-energy-profiler
        
        Best regards,
        The Breathing Flame Team
      `

      await emailTransporter.sendMail({
        from: functions.config().email?.user,
        to: email,
        subject: 'Welcome to Breathing Flame Newsletter',
        text: welcomeContent
      })

      return res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter'
      })

    } catch (error) {
      console.error('Newsletter signup error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
})

// Analytics tracking handler
export const trackEvent = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const { eventType, eventData, userId, sessionId } = req.body

      if (!eventType) {
        return res.status(400).json({ error: 'Event type is required' })
      }

      const event = {
        eventType,
        eventData: eventData || {},
        userId: userId || null,
        sessionId: sessionId || null,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }

      await admin.firestore().collection('analytics').add(event)

      return res.status(200).json({ success: true })

    } catch (error) {
      console.error('Analytics tracking error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  })
})

// Scheduled function to clean up old analytics data
export const cleanupAnalytics = functions.pubsub.schedule('0 2 * * 0').onRun(async (context) => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - 365) // Keep data for 1 year

  const query = admin.firestore()
    .collection('analytics')
    .where('timestamp', '<', cutoffDate)
    .limit(500)

  const snapshot = await query.get()
  
  if (snapshot.empty) {
    console.log('No old analytics data to clean up')
    return
  }

  const batch = admin.firestore().batch()
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref)
  })

  await batch.commit()
  console.log(`Cleaned up ${snapshot.size} old analytics records`)
})

