import { SEO } from '@/components/SEO'
import styles from './Privacy.module.css'

export function Privacy() {
  return (
    <>
      <SEO 
        data={{ 
          title: 'Privacy Policy - Breathing Flame', 
          description: 'Privacy policy for Breathing Flame S.L. - How we collect, use, and protect your personal information.' 
        }} 
      />
      
      <section className="section">
        <div className="container">
          <div className={styles.legalPage}>
            <header className={styles.header}>
              <h1 className={styles.title}>Privacy Policy</h1>
              <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className={styles.content}>
              <section className={styles.section}>
                <h2>1. Introduction</h2>
                <p>
                  Breathing Flame S.L. ("we," "our," or "us") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or participate in our programs.
                </p>
                <p>
                  We are a Spanish company registered under Spanish law, providing performance, wellness, and coaching services globally. We comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) for EU residents and other relevant privacy laws in your jurisdiction.
                </p>
              </section>

              <section className={styles.section}>
                <h2>2. Information We Collect</h2>
                
                <h3>2.1 Personal Information</h3>
                <p>We may collect the following types of personal information:</p>
                <ul>
                  <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
                  <li><strong>Account Information:</strong> Username, password, profile information</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by third-party providers)</li>
                  <li><strong>Health and Wellness Data:</strong> Information you voluntarily provide about your health, fitness goals, and wellness journey</li>
                  <li><strong>Program Participation:</strong> Information about your participation in our programs, assessments, and progress tracking</li>
                  <li><strong>Communication Records:</strong> Records of your communications with us, including support requests and feedback</li>
                </ul>

                <h3>2.2 Automatically Collected Information</h3>
                <p>We may automatically collect certain information when you use our services:</p>
                <ul>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website and services</li>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                  <li><strong>Location Data:</strong> General geographic location based on your IP address</li>
                  <li><strong>Cookies and Tracking Technologies:</strong> Information collected through cookies, web beacons, and similar technologies</li>
                </ul>

                <h3>2.3 Third-Party Information</h3>
                <p>We may receive information about you from third parties, such as:</p>
                <ul>
                  <li>Social media platforms when you connect your accounts</li>
                  <li>Payment processors for transaction verification</li>
                  <li>Analytics providers for website usage statistics</li>
                  <li>Marketing partners for lead generation</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>3. How We Use Your Information</h2>
                <p>We use your personal information for the following purposes:</p>
                
                <h3>3.1 Service Delivery</h3>
                <ul>
                  <li>Provide and maintain our services</li>
                  <li>Process payments and transactions</li>
                  <li>Deliver programs, workshops, and coaching sessions</li>
                  <li>Track your progress and provide personalized recommendations</li>
                  <li>Communicate with you about your account and services</li>
                </ul>

                <h3>3.2 Business Operations</h3>
                <ul>
                  <li>Improve our services and develop new features</li>
                  <li>Conduct research and analytics</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our terms of service</li>
                </ul>

                <h3>3.3 Marketing and Communications</h3>
                <ul>
                  <li>Send you newsletters and promotional materials (with your consent)</li>
                  <li>Notify you about new programs and events</li>
                  <li>Provide customer support</li>
                  <li>Conduct surveys and gather feedback</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>4. Legal Basis for Processing (GDPR)</h2>
                <p>For EU residents, we process your personal information based on the following legal grounds:</p>
                <ul>
                  <li><strong>Consent:</strong> When you have given clear consent for us to process your data for specific purposes</li>
                  <li><strong>Contract Performance:</strong> To fulfill our contractual obligations to you</li>
                  <li><strong>Legitimate Interests:</strong> To pursue our legitimate business interests, such as improving our services</li>
                  <li><strong>Legal Compliance:</strong> To comply with legal obligations</li>
                  <li><strong>Vital Interests:</strong> To protect your vital interests or those of another person</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>5. Information Sharing and Disclosure</h2>
                <p>We may share your personal information in the following circumstances:</p>
                
                <h3>5.1 Service Providers</h3>
                <p>We may share your information with trusted third-party service providers who assist us in operating our business, such as:</p>
                <ul>
                  <li>Payment processors (Stripe, PayPal)</li>
                  <li>Email service providers (Mailchimp, SendGrid)</li>
                  <li>Analytics providers (Google Analytics, Mixpanel)</li>
                  <li>Cloud storage providers (Google Cloud, AWS)</li>
                  <li>Customer support platforms (Zendesk, Intercom)</li>
                </ul>

                <h3>5.2 Legal Requirements</h3>
                <p>We may disclose your information if required by law or in response to:</p>
                <ul>
                  <li>Legal process or court orders</li>
                  <li>Government investigations</li>
                  <li>Protection of our rights and property</li>
                  <li>Prevention of fraud or illegal activities</li>
                </ul>

                <h3>5.3 Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>

                <h3>5.4 Consent</h3>
                <p>We may share your information with your explicit consent for specific purposes.</p>
              </section>

              <section className={styles.section}>
                <h2>6. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                <ul>
                  <li><strong>Encryption:</strong> Data is encrypted in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                  <li><strong>Regular Audits:</strong> Periodic security assessments and updates</li>
                  <li><strong>Staff Training:</strong> Regular training on data protection and privacy</li>
                  <li><strong>Incident Response:</strong> Procedures for handling data breaches</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section className={styles.section}>
                <h2>7. Data Retention</h2>
                <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:</p>
                <ul>
                  <li><strong>Account Information:</strong> Until you delete your account or request deletion</li>
                  <li><strong>Program Data:</strong> For the duration of your participation plus 3 years for record-keeping</li>
                  <li><strong>Payment Records:</strong> 7 years for tax and accounting purposes</li>
                  <li><strong>Marketing Data:</strong> Until you unsubscribe or withdraw consent</li>
                  <li><strong>Legal Compliance:</strong> As required by applicable laws</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>8. Your Rights and Choices</h2>
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                
                <h3>8.1 Access and Portability</h3>
                <p>You have the right to access your personal information and receive a copy in a portable format.</p>
                
                <h3>8.2 Rectification</h3>
                <p>You can request correction of inaccurate or incomplete personal information.</p>
                
                <h3>8.3 Erasure</h3>
                <p>You can request deletion of your personal information, subject to certain exceptions.</p>
                
                <h3>8.4 Restriction</h3>
                <p>You can request restriction of processing in certain circumstances.</p>
                
                <h3>8.5 Objection</h3>
                <p>You can object to processing based on legitimate interests or for marketing purposes.</p>
                
                <h3>8.6 Withdrawal of Consent</h3>
                <p>You can withdraw consent for processing that requires your consent.</p>
                
                <h3>8.7 Data Portability</h3>
                <p>You can request transfer of your data to another service provider.</p>
                
                <p>To exercise these rights, please contact us at privacy@breathingflame.com.</p>
              </section>

              <section className={styles.section}>
                <h2>9. International Data Transfers</h2>
                <p>
                  As a global service, we may transfer your personal information to countries outside your jurisdiction. When we do so, we ensure appropriate safeguards are in place:
                </p>
                <ul>
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions by relevant data protection authorities</li>
                  <li>Certification schemes and codes of conduct</li>
                  <li>Your explicit consent for specific transfers</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>10. Cookies and Tracking Technologies</h2>
                <p>We use cookies and similar technologies to enhance your experience:</p>
                
                <h3>10.1 Types of Cookies</h3>
                <ul>
                  <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                
                <h3>10.2 Cookie Management</h3>
                <p>You can control cookies through your browser settings or our cookie consent banner. However, disabling certain cookies may affect website functionality.</p>
              </section>

              <section className={styles.section}>
                <h2>11. Children's Privacy</h2>
                <p>
                  Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className={styles.section}>
                <h2>12. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section className={styles.section}>
                <h2>13. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </section>

              <section className={styles.section}>
                <h2>14. Data Protection Officer</h2>
                <p>
                  We have appointed a Data Protection Officer (DPO) to oversee our data protection practices. You can contact our DPO at:
                </p>
                <div className={styles.contactInfo}>
                  <p><strong>Data Protection Officer</strong></p>
                  <p>Email: dpo@breathingflame.com</p>
                  <p>Address: Breathing Flame S.L., Spain</p>
                </div>
              </section>

              <section className={styles.section}>
                <h2>15. Supervisory Authority</h2>
                <p>
                  If you are an EU resident and believe we have not addressed your privacy concerns, you have the right to lodge a complaint with your local data protection authority.
                </p>
                <p>
                  For Spanish residents, the relevant authority is the Agencia Española de Protección de Datos (AEPD).
                </p>
              </section>

              <section className={styles.section}>
                <h2>16. Contact Information</h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className={styles.contactInfo}>
                  <p><strong>Breathing Flame S.L.</strong></p>
                  <p>Email: privacy@breathingflame.com</p>
                  <p>Website: https://breathingflame.com</p>
                  <p>Address: Spain</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
