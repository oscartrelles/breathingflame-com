import * as functions from 'firebase-functions'
import * as corsLib from 'cors'
import fetch from 'node-fetch'

const cors = corsLib({ origin: true })

export const contact = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).end()
      return
    }
    const { name, email, type, message } = req.body || {}
    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: 'Missing fields' })
      return
    }

    try {
      const apiKey = process.env.MAILERSEND_API_KEY as string
      const sender = process.env.MAILERSEND_SENDER as string
      const receiver = process.env.CONTACT_RECEIVER as string
      const payload = {
        from: { email: sender, name: 'Breathing Flame Contact Form' },
        to: [{ email: receiver, name: 'Breathing Flame' }],
        subject: `New Contact Form Submission – ${type || 'General'}`,
        text: `Name: ${name}\nEmail: ${email}\nType: ${type}\nMessage:\n${message}`,
        reply_to: { email, name }
      }

      const r = await fetch('https://api.mailersend.com/v1/email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!r.ok) throw new Error(`MailerSend error ${r.status}`)
      res.status(200).json({ ok: true })
    } catch (e) {
      console.error(e)
      res.status(500).json({ ok: false, error: 'MailerSend failed' })
    }
  })
})


