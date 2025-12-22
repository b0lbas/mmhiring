'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export default function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary-dark/80 backdrop-blur-glass"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
            <span className="text-white">Match</span>
            <span className="text-primary-pink">Makers</span>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {['about', 'services', 'clients', 'contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05, color: '#d24a98' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item)}
                className="text-white capitalize"
              >
                {item}
              </motion.button>
            ))}
            <Link href="/blog" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.05, color: '#d24a98' }}
                whileTap={{ scale: 0.95 }}
                className="text-white cursor-pointer"
                style={{ display: 'inline-block' }}
              >
                Blog
              </motion.a>
            </Link>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-pink text-white px-6 py-2 rounded-full font-semibold"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
} 