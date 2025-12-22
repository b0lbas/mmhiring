'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RadialExperience() {
  const [isVisible, setIsVisible] = useState(false);
  
  const features = [
    { title: '10+ years in recruitment strategy', icon: '🧠' },
    { title: 'Global hiring across 15+ markets', icon: '🌍' },
    { title: 'Vast network of top-tier professionals', icon: '👥' },
    { title: 'Built recruitment teams from scratch', icon: '🏗️' },
    { title: 'Deep roots in tech & gaming', icon: '🎮' },
    { title: 'Scaled teams from startup to 300+', icon: '📈' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('radial-experience');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section id="radial-experience" className="w-full py-32 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-glass p-6 rounded-xl border border-white/10 shadow-glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{feature.icon}</span>
                <span className="text-white/90 font-medium">{feature.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 