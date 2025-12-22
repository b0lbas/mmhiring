'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import TeamStructure from './components/TeamStructure';
import Link from 'next/link';
import Head from 'next/head';

type Client = {
  id: number;
  name: string;
  logo: string;
  website?: string;
  active: boolean;
  order: number;
};

export default function Home() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    request: ''
  });
  const [errors, setErrors] = useState<{ companyName?: string; email?: string; request?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      // Fallback to empty array if API fails
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  function validate() {
    const newErrors: { companyName?: string; email?: string; request?: string } = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Invalid email address.';
    if (!formData.request.trim()) newErrors.request = 'Request is required.';
    return newErrors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Произошла ошибка при отправке сообщения');
        }
        
        setSubmitted(true);
        setFormData({ companyName: '', email: '', request: '' });
        setTimeout(() => setSubmitted(false), 3000);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>MatchMakers Hiring</title>
        <meta name="description" content="Connecting top tech talent with innovative companies." />
        <link rel="icon" href="/uploads/micrologo.png" />
      </Head>

      <Header />
      <main className="min-h-screen bg-gradient-to-b from-primary-dark to-primary-blue pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-[90vh] flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-dark opacity-50"></div>
            <div className="relative z-10 -mt-20">
              <motion.h1 
                className="text-7xl md:text-8xl font-bold mb-6 text-white font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                UNLOCKING THE POWER OF TALENT, WORLDWIDE.
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link 
                  href="#contact" 
                  className="inline-block bg-gradient-pink text-white px-16 py-6 rounded-full font-semibold text-2xl md:text-3xl hover:shadow-glow transition-all duration-300"
                >
                  Let's Get Hiring
                </Link>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mt-24 mb-20"
          >
            <h2 id="about" className="text-4xl font-bold text-white mb-6 font-display">Who we are</h2>
            <div className="text-lg text-gray-300 leading-relaxed">
              We are partners committed to your success, dedicated to finding the ideal match for your team. We understand the importance of time and the impact a wrong hire can have on your business. That&apos;s why we offer personalized recruitment services that prioritize efficiency and effectiveness. At MatchMakers we try to create the perfect synergy between your company and exceptional talent.
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-32 w-full max-w-6xl mx-auto"
          >
            <h2 id="services" className="text-4xl font-bold text-white mb-12 text-center font-display">Main reasons to choose MatchMakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "Quality", description: "We understand the importance of time and the impact a wrong hire can have on your business.", icon: "✅" },
                { title: "Personalization", description: "We offer personalized recruitment services that prioritize efficiency and effectiveness.", icon: "🧩" },
                { title: "Experience", description: "Our team members brings over five years of experience in hiring top-tier professionals.", icon: "🏆" },
                { title: "Transparency", description: "We are committed to transparency at every stage, providing full visibility into our processes.", icon: "🔎" }
              ].map((reason, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-glass p-8 rounded-xl border border-white/10 shadow-glass text-center"
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                >
                  <div className="text-4xl mb-4">{reason.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{reason.title}</h3>
                  <p className="text-gray-300">{reason.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-32 w-full max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6 text-center font-display">What we can offer</h2>
            <ul className="list-disc list-inside text-lg text-gray-300 space-y-3">
              <li>Source top talent for your company, startup, or new projects.</li>
              <li>Build teams where employees complement each other and work towards your company&apos;s goals.</li>
              <li>Guide you through every step of the recruitment process with care, making it seamless and effective.</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            <h2 id="clients" className="text-4xl font-bold text-white mb-12 text-center font-display">Our Clients</h2>
            {clientsLoading ? (
              <div className="text-center text-white">Loading clients...</div>
            ) : clients.length > 0 ? (
              <div className="flex flex-wrap gap-x-4 gap-y-4 justify-center items-center mb-20">
                {clients.map((client) => (
                  <motion.div
                    key={client.id}
                    className="bg-white/5 backdrop-blur-glass rounded-xl border border-white/10 shadow-glass flex items-center justify-center h-36 w-[360px]"
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  >
                    {client.website ? (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-full w-full flex items-center justify-center"
                      >
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="h-full w-full object-contain px-6"
                        />
                      </a>
                    ) : (
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="h-full w-full object-contain px-6"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white">No clients to display</div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-32 w-full max-w-2xl mx-auto"
          >
            <h2 id="contact" className="text-4xl font-bold text-white mb-12 text-center font-display">Let&apos;s Get Hiring</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-white mb-2">Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  className="w-full bg-white/5 backdrop-blur-glass p-4 rounded-xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  aria-label="Company Name"
                  aria-invalid={!!errors.companyName}
                  required
                />
                {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-white/5 backdrop-blur-glass p-4 rounded-xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-pink"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  aria-label="Email"
                  aria-invalid={!!errors.email}
                  required
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="request" className="block text-white mb-2">Request</label>
                <textarea
                  id="request"
                  className="w-full bg-white/5 backdrop-blur-glass p-4 rounded-xl border border-white/10 text-white h-32 focus:outline-none focus:ring-2 focus:ring-primary-pink"
                  value={formData.request}
                  onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  aria-label="Request"
                  aria-invalid={!!errors.request}
                  required
                />
                {errors.request && <p className="text-red-400 text-sm mt-1">{errors.request}</p>}
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(210, 74, 152, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-pink text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300"
                aria-label="Send Request"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Send Request'}
              </motion.button>
              {submitted && (
                <div className="text-green-400 text-center mt-4" role="status">
                  Thank you! Your request has been received.
                </div>
              )}
              {submitError && (
                <div className="text-red-400 text-center mt-4" role="alert">
                  {submitError}
                </div>
              )}
            </form>
          </motion.section>

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 py-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-bold">
                  <span className="text-white">Match</span>
                  <span className="text-primary-pink">Makers</span>
                </h3>
              </div>
              <div className="flex items-center space-x-6 text-gray-300">
                <a href="mailto:hello@mmhiring.com" className="hover:text-primary-pink transition-colors">
                  hello@mmhiring.com
                </a>
                <a href="https://www.linkedin.com/company/mmhiring/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-pink transition-colors flex items-center">
                  <span className="sr-only">LinkedIn</span>
                  <img
                    src="/micrologos/linkedin.png"
                    alt="LinkedIn"
                    className="h-5 w-5 object-contain"
                  />
                </a>
                <a href="https://www.instagram.com/matchmakers_hiring" target="_blank" rel="noopener noreferrer" className="hover:text-primary-pink transition-colors flex items-center">
                  <span className="sr-only">Instagram</span>
                  <img
                    src="/micrologos/instagram.png"
                    alt="Instagram"
                    className="h-5 w-5 object-contain"
                  />
                </a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-center text-gray-300 text-sm">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p> {new Date().getFullYear()} MatchMakers. All rights reserved.</p>
                <Link href="/privacy-policy" className="hover:text-primary-pink transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </motion.footer>
        </div>
      </main>
    </>
  );
}