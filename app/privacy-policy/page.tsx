'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Логотип по центру */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-12"
          >
            <img
              src="/uploads/MM_logo_Color_transp.svg"
              alt="MatchMakers"
              className="h-24 w-auto md:h-32"
            />
          </motion.div>

          {/* Текст Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-invert max-w-none text-white"
          >
            <h1 className="text-4xl font-bold text-white mb-8 text-center font-display">PRIVACY POLICY</h1>
            
            <p className="text-gray-300 mb-6 text-center">Effective Date: February 24, 2025</p>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                <strong className="text-white">WELCOME TO MATCHMAKERS&apos; PRIVACY POLICY!</strong>
              </p>

              <p>
                At MatchMakers (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we specialize in matching talented individuals (&quot;Candidates&quot;) with amazing employers (&quot;Clients&quot;). Our website, https://mmhiring.com/, helps make this happen while ensuring your personal data is handled with the highest standards of privacy and security.
              </p>

              <p>
                This Privacy Policy outlines what data we collect, how we use it, when we share it, and how we protect it, all in line with the General Data Protection Regulation (GDPR) and other relevant laws. Because your trust is as important to us as your career!
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">UPDATES TO THIS POLICY</h2>
              <p>
                This Privacy Policy may be updated from time to time to reflect changes in our practices or legal requirements. If we make significant updates, we will notify you either through our website or via direct communication channels. We encourage you to check back occasionally to stay informed!
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">WHAT IS PERSONAL DATA &amp; WHO HANDLES IT?</h2>
              <p>
                Personal Data is any information that identifies you or could be used to identify you - basically, anything that makes you you! This could be your name, contact details, CV information, or even preferences for your dream job.
              </p>
              <p>
                At MatchMakers, we take your privacy seriously and handle your data with care, transparency, and full compliance with applicable data protection laws. MatchMakers is a brand operated by Volha Bubiantsova, a sole trader (Polish: jednoosobowa działalność gospodarcza) registered in Poland under NIP: 6762620945 and REGON: 522463807, who serves as the data controller, determining how and why your personal data is processed. In some cases, as outlined in this Privacy Policy, we may also act as a processor, handling your data on behalf of another organization that determines its purpose.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">WHAT DATA WE COLLECT?</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Data from Candidates</h3>
              <p>
                When you apply for a job through our website, Applicant Tracking System (ATS), job boards, or other channels, we collect the necessary details to match you with suitable opportunities. This includes your name, address, phone number, email, social media contact info, and any documents you submit, such as your CV and cover letter. We also collect data about your work experience, education history, skills, professional qualifications, language proficiency (including native and additional languages), and job preferences, such as your desired role, location, and salary expectations. In some cases, we may request additional details if required for the recruitment process.
              </p>
              <p>
                Beyond what you directly provide, we may also gather professional details from publicly available sources such as LinkedIn, job boards, or CV databases where you have chosen to make your data accessible. This helps us connect with potential candidates who may be a great fit for open roles.
              </p>
              <p>
                In certain situations, we may process sensitive personal data, such as health-related information or disabilities, but only when it is necessary for the recruitment process and with your explicit consent (or where required by law).
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Data from Clients</h3>
              <p>
                <strong className="text-white">Essential Client Information We Use.</strong> To provide effective recruitment services, we collect only the necessary business information through questionnaire that you voluntarily fill out, including contact details (name, email, phone number), job vacancy details, and company background. This may include your company name, website, industry focus, hiring locations, team structure, employment conditions, and key business projects. We may also gather insights on company culture, benefits, and preferred candidate sources to ensure the best talent match.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Automatically Collected Data</h3>
              <p>
                When you visit our website or communicate with us, certain data is collected automatically to improve functionality and enhance your experience. This includes IP addresses, browser type, device information, and website usage data, which are gathered through cookies and similar tracking technologies. For more details on how we use cookies, please see our Cookie Policy below.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">HOW WE USE YOUR DATA?</h2>
              <p>
                We process personal data strictly to deliver high-quality recruitment services while ensuring full compliance with GDPR. Whether you are a Candidate seeking new career opportunities or a Client looking for top talent, we handle your data lawfully, transparently, and securely.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">For Candidates.</h3>
              <p>We process your personal data for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Identifying potential job opportunities that align with your skills and experience (legitimate interest – essential for recruitment services).</li>
                <li>Assessing your qualifications, skills, and personality to match you with suitable roles (legitimate interest – to improve placement success).</li>
                <li>Introducing you to Clients for job vacancies and other relevant recruitment services (performance of contract, legitimate interest – necessary for recruitment fulfillment).</li>
                <li>Collecting reference statements from previous employers to verify experience and credibility (legitimate interest – ensures hiring quality and accuracy).</li>
                <li>Communicating with you about job openings, interview processes, and feedback (legitimate interest, performance of contract – essential for recruitment operations).</li>
                <li>Processing sensitive data (e.g., health-related information or disabilities) when necessary, but only with your explicit consent (consent, legal obligation – ensures equal opportunities and compliance with anti-discrimination laws).</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">For Clients.</h3>
              <p>We process Client data for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Identifying and recommending suitable Candidates for job vacancies (performance of contract, legitimate interest – to fulfill recruitment agreements).</li>
                <li>Facilitating and managing hiring processes, including communication, interviews, and documentation (performance of contract, legitimate interest – ensures smooth recruitment).</li>
                <li>Selling and marketing recruitment services, including maintaining Client relationships and business development (legitimate interest – necessary for service provision and growth).</li>
                <li>Keeping statistical records and optimizing audience targeting to improve recruitment efficiency (legitimate interest – data-driven service enhancement).</li>
                <li>Responding to individual Client requests and inquiries to ensure smooth collaboration (legitimate interest – necessary for Client service).</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Compliance &amp; Legal Obligations.</h3>
              <p>Some processing activities are required by law, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ensuring compliance with employment and anti-discrimination laws, including handling disputes related to alleged discrimination (legal obligation - promotes fair hiring practices and legal compliance).</li>
                <li>Maintaining proper documentation for legal and audit purposes, where applicable (legal obligation - ensures accountability and compliance with industry standards).</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">SHARING YOUR DATA</h2>
              <p>
                We team up with trusted third-party processors to help us handle personal data, ensuring they meet GDPR&apos;s high standards. While we prefer to keep data processing within the EU/EEA, some of our processors are based in the United States, where we use EU Commission-approved Standard Contractual Clauses (SCCs) to keep your data safe.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Clients.</h3>
              <p>
                When we introduce Candidates to Clients, we share only the necessary data required for evaluating job applications. Clients are obligated to:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>use Candidate data strictly for recruitment purposes;</li>
                <li>protect the data from unauthorized access, misuse, or loss;</li>
                <li>delete the data once it is no longer needed for the hiring process.</li>
              </ol>
              <p>
                To ensure compliance with GDPR, MatchMakers enters into data protection agreements with Clients, reinforcing their responsibility to handle your data securely and lawfully.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Service Providers.</h3>
              <p>We may share your data with third-party vendors who help us operate efficiently, including those providing:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IT support &amp; system maintenance to ensure our services run smoothly;</li>
                <li>hosting and cloud storage to keep data secure and accessible;</li>
                <li>Applicant Tracking System (ATS) services, which we use to manage candidate applications, track recruitment processes, and facilitate secure data processing;</li>
                <li>data analytics &amp; performance tracking to optimize our recruitment services.</li>
              </ul>
              <p>
                All service providers are contractually bound to protect your personal data and may not use it for any purpose other than the services they provide to us.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Regulators &amp; Legal Authorities.</h3>
              <p>In certain circumstances, we may be required to disclose your data to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>regulatory authorities or government agencies to comply with legal obligations (e.g., tax, employment, or anti-discrimination laws);</li>
                <li>law enforcement or courts when necessary to resolve disputes or comply with legal proceedings.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">YOUR RIGHTS</h2>
              <p>
                Below is a summary of your key rights and how you can exercise them. If you are EU, EEA or UK resident, you have the right to:
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Access (Subject Access Request).</h3>
              <p>
                You have the right to request a copy of the personal data we hold about you, along with information on how and why we process it. If you&apos;d like to access your data, simply reach out to us at legal@mmhiring.com, and we&apos;ll provide the details within one month.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Rectification.</h3>
              <p>
                If you believe the data we hold about you is incorrect or incomplete, you can request that we update or correct it. We will make the necessary amendments promptly to ensure your data is accurate and up to date.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Erasure.</h3>
              <p>You can request the deletion of your personal data if:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>it is no longer needed for its original purpose;</li>
                <li>you withdraw your consent and there is no other legal basis for processing;</li>
                <li>processing is unlawful or you successfully object to its processing.</li>
              </ul>
              <p>
                Please note that some legal obligations may prevent us from deleting your data immediately, such as compliance with tax or employment laws.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Restriction of Processing.</h3>
              <p>In certain cases, you can ask us to limit the processing of your data, such as when:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>you contest the accuracy of your data.</li>
                <li>you object to our processing activities, and we need to verify whether we have overriding legitimate grounds.</li>
              </ul>
              <p>
                During this restriction period, we will continue to store your data but will not process it further until the matter is resolved.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Data Portability.</h3>
              <p>
                If you want to take your data elsewhere, you can request that we provide it in a structured, commonly used, and machine-readable format. If technically feasible, you can also ask us to transfer it directly to another data controller.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Object.</h3>
              <p>You can object to the processing of your personal data when it is based on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>legitimate interests, if you believe your rights override our processing reasons;</li>
                <li>direct marketing, in which case we will immediately stop sending you marketing communications.</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Withdraw Consent.</h3>
              <p>
                If we process your data based on your consent, you can withdraw it at any time - this won&apos;t affect any processing carried out before the withdrawal. To withdraw consent, simply contact us at legal@mmhiring.com.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Right to Lodge a Complaint.</h3>
              <p>
                If you believe we are not handling your data lawfully, you have the right to file a complaint with a data protection authority in your country of residence. We always encourage you to contact us first, and we will do our best to resolve any concerns.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">DATA RETENTION</h2>
              <p>
                <strong className="text-white">Candidate data:</strong> We retain your data as long as it is necessary for providing our services and maintaining professional relationships. To ensure relevance, we review data regularly every 2 years and delete or anonymize information that is no longer needed.
              </p>
              <p>
                <strong className="text-white">Client data:</strong> We retain client data for the duration of our business relationship and as long as required by applicable laws and regulatory obligations. To ensure compliance with data minimization and storage limitation principles (Article 5(1)(c) and (e) GDPR), we conduct periodic reviews to assess whether continued storage is necessary. Any data that is no longer needed will be securely deleted or anonymized.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4 font-display">DATA SECURITY</h2>
              <p>
                We implement organizational and technical security measures to safeguard your personal data.
              </p>
              <p>
                Our organizational measures include internal policies, login and password management, and physical security for our premises, ensuring compliance with secure working practices.
              </p>
              <p>
                Our technical measures include encryption, pseudonymisation, access controls, secure networks, firewalls, backups, and regular security assessments to protect data from unauthorized access and cyber threats.
              </p>

              {/* Кнопка возврата на главную */}
              <div className="mt-12 text-center">
                <Link 
                  href="/" 
                  className="inline-block bg-gradient-pink text-white px-8 py-3 rounded-full font-semibold hover:shadow-glow transition-all duration-300"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

