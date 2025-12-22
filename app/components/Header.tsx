'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleNavClick = (sectionId: string) => {
    if (isHomePage) {
      // Если на главной странице - скроллим к секции
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если на другой странице - переходим на главную с якорем
      window.location.href = `/#${sectionId}`;
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
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer flex items-center"
            >
              <img
                src="/uploads/MM_logo_Color_transp.svg"
                alt="MatchMakers"
                className="h-8 w-auto md:h-9"
              />
            </motion.div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {['about', 'services', 'clients', 'contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05, color: '#d24a98' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item)}
                className="text-white capitalize cursor-pointer"
              >
                {item}
              </motion.button>
            ))}
            <Link href="/blog">
              <motion.span
                whileHover={{ scale: 1.05, color: '#d24a98' }}
                whileTap={{ scale: 0.95 }}
                className="text-white cursor-pointer"
                style={{ display: 'inline-block' }}
              >
                Blog
              </motion.span>
            </Link>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavClick('contact')}
            className="bg-gradient-pink text-white px-6 py-2 rounded-full font-semibold cursor-pointer"
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
} 