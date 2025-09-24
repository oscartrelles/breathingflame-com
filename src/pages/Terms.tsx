import { SEO } from '@/components/SEO'
import styles from './Terms.module.css'

export function Terms() {
  return (
    <>
      <SEO 
        data={{ 
          title: 'Terms of Service - Breathing Flame', 
          description: 'Terms of service for Breathing Flame S.L. - Performance, wellness, and coaching services.' 
        }} 
      />
      
      <section className="section">
        <div className="container">
          <div className={styles.legalPage}>
            <header className={styles.header}>
              <h1 className={styles.title}>Terms of Service</h1>
              <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className={styles.content}>
              <section className={styles.section}>
                <h2>1. Introduction</h2>
                <p>
                  Welcome to Breathing Flame S.L. ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, services, and programs related to performance, wellness, and coaching. By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p>
                  Breathing Flame S.L. is a Spanish company registered under Spanish law, with our principal place of business in Spain. We provide services globally to individuals and organizations seeking to improve their performance, wellbeing, and personal transformation.
                </p>
              </section>

              <section className={styles.section}>
                <h2>2. Services Description</h2>
                <p>Our services include but are not limited to:</p>
                <ul>
                  <li>Breathwork and mindfulness training programs</li>
                  <li>Performance coaching and leadership development</li>
                  <li>Organizational transformation consulting</li>
                  <li>Online and in-person workshops and retreats</li>
                  <li>Digital resources, assessments, and educational content</li>
                  <li>Community forums and support groups</li>
                </ul>
                <p>
                  All services are provided for educational and personal development purposes. We do not provide medical, psychological, or therapeutic services, and our programs are not intended to replace professional medical or psychological treatment.
                </p>
              </section>

              <section className={styles.section}>
                <h2>3. User Responsibilities</h2>
                <h3>3.1 Eligibility</h3>
                <p>You must be at least 18 years old to use our services. By using our services, you represent and warrant that you meet this age requirement.</p>
                
                <h3>3.2 Account Security</h3>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                
                <h3>3.3 Prohibited Uses</h3>
                <p>You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our services. Prohibited activities include:</p>
                <ul>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Transmitting harmful or malicious code</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Harassing or threatening other users</li>
                  <li>Sharing false or misleading information</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>4. Health and Safety Disclaimer</h2>
                <p>
                  <strong>IMPORTANT:</strong> Our breathwork, cold exposure, and physical practices may not be suitable for everyone. You should consult with a healthcare provider before participating in any physical activities, especially if you have:
                </p>
                <ul>
                  <li>Cardiovascular conditions</li>
                  <li>Respiratory conditions</li>
                  <li>Pregnancy or recent pregnancy</li>
                  <li>Epilepsy or seizure disorders</li>
                  <li>High blood pressure</li>
                  <li>Any other medical conditions that may be affected by breathwork or cold exposure</li>
                </ul>
                <p>
                  You participate in our programs at your own risk. We are not responsible for any injuries or health issues that may arise from participation in our services.
                </p>
              </section>

              <section className={styles.section}>
                <h2>5. Payment Terms</h2>
                <h3>5.1 Pricing and Payment</h3>
                <p>All prices are listed in EUR unless otherwise specified. Payment is due at the time of booking or as specified in your service agreement.</p>
                
                <h3>5.2 Refunds and Cancellations</h3>
                <p>
                  Refund policies vary by service type:
                </p>
                <ul>
                  <li><strong>Online Programs:</strong> 14-day money-back guarantee from the start date</li>
                  <li><strong>Workshops and Retreats:</strong> Full refund if cancelled 30+ days in advance, 50% refund if cancelled 14-29 days in advance</li>
                  <li><strong>Coaching Services:</strong> 24-hour cancellation policy for individual sessions</li>
                  <li><strong>Digital Products:</strong> No refunds for downloadable content</li>
                </ul>
                
                <h3>5.3 Currency and Taxes</h3>
                <p>Prices may be subject to applicable taxes based on your location. You are responsible for any taxes, duties, or fees imposed by your local jurisdiction.</p>
              </section>

              <section className={styles.section}>
                <h2>6. Intellectual Property</h2>
                <h3>6.1 Our Content</h3>
                <p>
                  All content, including text, graphics, logos, images, audio, video, and software, is owned by Breathing Flame S.L. or our licensors and is protected by copyright and other intellectual property laws.
                </p>
                
                <h3>6.2 License to Use</h3>
                <p>
                  We grant you a limited, non-exclusive, non-transferable license to access and use our content for personal, non-commercial purposes only.
                </p>
                
                <h3>6.3 User-Generated Content</h3>
                <p>
                  By submitting content to our platform, you grant us a worldwide, royalty-free license to use, modify, and distribute such content in connection with our services.
                </p>
              </section>

              <section className={styles.section}>
                <h2>7. Privacy and Data Protection</h2>
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) for EU residents and other relevant privacy laws in your jurisdiction.
                </p>
              </section>

              <section className={styles.section}>
                <h2>8. Limitation of Liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, BREATHING FLAME S.L. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF OUR SERVICES.
                </p>
                <p>
                  Our total liability to you for any claims arising from these Terms or your use of our services shall not exceed the amount you paid us for the specific service giving rise to the claim.
                </p>
              </section>

              <section className={styles.section}>
                <h2>9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless Breathing Flame S.L. and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
                </p>
              </section>

              <section className={styles.section}>
                <h2>10. Termination</h2>
                <p>
                  We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including if you breach these Terms.
                </p>
                <p>
                  Upon termination, your right to use our services will cease immediately, and we may delete your account and data.
                </p>
              </section>

              <section className={styles.section}>
                <h2>11. Governing Law and Dispute Resolution</h2>
                <p>
                  These Terms are governed by Spanish law. Any disputes arising from these Terms or your use of our services will be subject to the exclusive jurisdiction of the courts of Spain.
                </p>
                <p>
                  Before pursuing legal action, we encourage you to contact us directly to resolve any disputes through good faith negotiations.
                </p>
              </section>

              <section className={styles.section}>
                <h2>12. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on our website and updating the "Last updated" date.
                </p>
                <p>
                  Your continued use of our services after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className={styles.section}>
                <h2>13. Severability</h2>
                <p>
                  If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will remain in full force and effect.
                </p>
              </section>

              <section className={styles.section}>
                <h2>14. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className={styles.contactInfo}>
                  <p><strong>Breathing Flame S.L.</strong></p>
                  <p>Email: legal@breathingflame.com</p>
                  <p>Website: https://breathingflame.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}