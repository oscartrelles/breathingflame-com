#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

const EN_JSON_PATH = path.join(process.cwd(), 'src/content/en.json')

interface FAQItem {
  q: string
  a: string
}

interface FAQBlock {
  title: string
  subtitle: string
  items: FAQItem[]
}

// Sample FAQ data for each page
const pageFAQs: Record<string, FAQBlock> = {
  programs: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about our programs and experiences",
    items: [
      {
        q: "What's the difference between programs and experiences?",
        a: "Programs are comprehensive, multi-session journeys designed for deep transformation, while experiences are shorter, intensive sessions focused on specific techniques or outcomes."
      },
      {
        q: "Do I need any prior experience with breathwork?",
        a: "No prior experience is necessary. Our programs and experiences are designed for all levels, from complete beginners to advanced practitioners."
      },
      {
        q: "What should I bring to a session?",
        a: "Just bring yourself in comfortable clothing. We provide all necessary equipment including mats, blankets, and cushions."
      },
      {
        q: "Are sessions available online?",
        a: "Yes, we offer both in-person and online sessions. Check the specific program or experience details for availability."
      },
      {
        q: "How do I choose the right program for me?",
        a: "Consider your goals, time availability, and preferred intensity level. Our team can also help you choose the best option during a consultation."
      }
    ]
  },
  individuals: {
    title: "Frequently Asked Questions",
    subtitle: "Common questions about personal transformation and our approach",
    items: [
      {
        q: "How long does it take to see results?",
        a: "Many people notice immediate benefits after their first session, with deeper transformation occurring over weeks and months of consistent practice."
      },
      {
        q: "Is breathwork safe for everyone?",
        a: "While generally safe, some conditions may require medical clearance. We'll discuss your health history during intake to ensure safety."
      },
      {
        q: "What if I can't attend a scheduled session?",
        a: "We offer flexible rescheduling options and make-up sessions. Please contact us at least 24 hours in advance when possible."
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes, we offer flexible payment options for our programs. Contact us to discuss what works best for your situation."
      },
      {
        q: "Can I practice these techniques at home?",
        a: "Absolutely! We provide guidance and resources for safe home practice, and many of our techniques are designed for daily use."
      }
    ]
  },
  organizations: {
    title: "Frequently Asked Questions",
    subtitle: "Everything organizations need to know about our corporate solutions",
    items: [
      {
        q: "What types of organizations do you work with?",
        a: "We work with companies of all sizes, from startups to Fortune 500s, across various industries including tech, healthcare, finance, and education."
      },
      {
        q: "How do you customize programs for our organization?",
        a: "We conduct a thorough assessment of your team's needs, culture, and goals, then design a tailored program that aligns with your specific challenges and objectives."
      },
      {
        q: "What's the minimum group size for corporate programs?",
        a: "We can work with groups as small as 10 people, though our most effective programs typically involve 20-50 participants."
      },
      {
        q: "Do you offer both in-person and virtual sessions?",
        a: "Yes, we provide flexible delivery options including in-person, virtual, and hybrid formats to accommodate your team's needs and location."
      },
      {
        q: "How do you measure program success?",
        a: "We use a combination of surveys, performance metrics, and qualitative feedback to track improvements in stress levels, focus, collaboration, and overall well-being."
      },
      {
        q: "What's the typical program duration?",
        a: "Programs range from 4-12 weeks depending on your goals. We also offer intensive workshops and ongoing support options."
      }
    ]
  },
  contact: {
    title: "Frequently Asked Questions",
    subtitle: "Quick answers to common questions about getting in touch",
    items: [
      {
        q: "What's the best way to reach you?",
        a: "For general inquiries, use our contact form. For urgent matters, call us directly. We typically respond within 24 hours."
      },
      {
        q: "Do you offer consultations?",
        a: "Yes, we offer free 15-minute consultations to help you choose the right program or answer specific questions about our services."
      },
      {
        q: "What information should I include in my message?",
        a: "Please include your name, contact information, specific questions or goals, and any relevant background information about your experience with breathwork."
      },
      {
        q: "Do you have a physical location?",
        a: "Yes, we have a studio in [Location]. We also offer sessions at your location for corporate clients and online sessions worldwide."
      },
      {
        q: "What are your business hours?",
        a: "We're available Monday-Friday 9 AM - 6 PM, and weekends by appointment. Online sessions are available outside these hours."
      }
    ]
  },
  about: {
    title: "Frequently Asked Questions",
    subtitle: "Learn more about our mission, methods, and team",
    items: [
      {
        q: "How did Breathing Flame get started?",
        a: "Breathing Flame was founded by [Founder Name] after experiencing the transformative power of breathwork during a personal crisis. We've since helped thousands of people discover their inner strength."
      },
      {
        q: "What makes your approach different?",
        a: "We combine ancient breathing techniques with modern neuroscience and psychology, creating a holistic approach that addresses both physical and emotional well-being."
      },
      {
        q: "Are your instructors certified?",
        a: "Yes, all our instructors are certified in breathwork and related modalities. Many hold additional certifications in psychology, yoga, or other healing arts."
      },
      {
        q: "What's your success rate?",
        a: "Over 90% of our clients report significant improvements in stress levels, focus, and overall well-being within the first month of practice."
      },
      {
        q: "Do you offer scholarships or sliding scale pricing?",
        a: "Yes, we believe breathwork should be accessible to everyone. We offer scholarships and sliding scale options for those who need financial assistance."
      },
      {
        q: "How can I stay updated on new programs?",
        a: "Subscribe to our newsletter, follow us on social media, or check our website regularly for new programs, workshops, and special events."
      }
    ]
  }
}

function addPageFAQs() {
  console.log('📖 Adding FAQ blocks to main pages...')
  
  // Read current en.json
  const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'))
  
  // Add FAQs to each page
  for (const [pageKey, faqData] of Object.entries(pageFAQs)) {
    if (enJson.pages && enJson.pages[pageKey]) {
      enJson.pages[pageKey].faq = faqData
      console.log(`✅ Added FAQ to pages.${pageKey}`)
    } else {
      console.log(`⚠️  Page pages.${pageKey} not found, skipping...`)
    }
  }
  
  // Write back to file
  fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJson, null, 2))
  console.log('✅ FAQ blocks added successfully!')
}

// Run the script
addPageFAQs()

