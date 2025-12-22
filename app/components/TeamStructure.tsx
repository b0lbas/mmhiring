'use client';

import { motion } from 'framer-motion';

export default function TeamStructure() {
  return (
    <section className="w-full py-32 relative">
      <div className="container mx-auto px-4">
        <div className="relative max-w-6xl mx-auto min-h-[800px]">
          <div className="grid grid-cols-2 gap-32 mb-48">
            <div className="flex flex-col items-center space-y-6">
              <div className="space-y-6 text-center">
                <motion.div 
                  className="text-white/90 text-lg relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Lorem ipsum dolor sit amet
                  <div className="absolute left-1/2 bottom-[-80px] w-[1px] h-[80px] bg-white/30" />
                </motion.div>
                <motion.div 
                  className="text-white/90 text-lg relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Duis aute irure dolor in reprehenderit
                  <div className="absolute left-1/2 bottom-[-120px] w-[1px] h-[120px] bg-white/30" />
                </motion.div>
                <motion.div 
                  className="text-white/90 text-lg relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Lorem ipsum dolor sit amet, consectetur
                  <div className="absolute left-1/2 bottom-[-160px] w-[1px] h-[160px] bg-white/30" />
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="space-y-6 text-center">
                <motion.div 
                  className="text-white/90 text-lg relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Sed do eiusmod tempor incididunt
                  <div className="absolute left-1/2 bottom-[-120px] w-[1px] h-[120px] bg-white/30" />
                </motion.div>
                <motion.div 
                  className="text-white/90 text-lg relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Lorem ipsum dolor sit amet, consectetur
                  <div className="absolute left-1/2 bottom-[-160px] w-[1px] h-[160px] bg-white/30" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 top-[400px] w-[60%] h-[1px] bg-white/30 -translate-x-1/2" />

          <motion.div 
            className="text-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-bold text-white mb-32">MatchMakers</h1>
            
            <div className="absolute left-1/2 top-[50%] w-[90%] h-[1px] bg-white/30 -translate-x-1/2" />
            
            <div className="absolute left-1/2 bottom-[-100px] w-[1px] h-[100px] bg-white/30" />

            <div className="absolute left-1/2 bottom-[-100px] w-[90%] h-[1px] bg-white/30 -translate-x-1/2" />

            <div className="grid grid-cols-3 gap-8 mt-48">
              <motion.div 
                className="text-white/90 text-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Lorem ipsum dolor sit amet, consectetur
              </motion.div>
              <motion.div 
                className="text-white/90 text-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Lorem ipsum dolor sit amet
              </motion.div>
              <motion.div 
                className="text-white/90 text-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Lore ipsum dolor sit amet
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 