'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PageTransition({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const [visible, setVisible] = useState(show);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setFade(false);
    } else if (!show) {
      setTimeout(() => setVisible(false), 800);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show || visible ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          initial={{ background: 'rgba(20,25,50,0.1)', opacity: 1 }}
          animate={{ background: fade ? 'var(--main-bg, #1a1f2e)' : 'rgba(20,25,50,0.1)', opacity: fade ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ background: { duration: 0.5 }, opacity: { duration: 0.5 } }}
        >
          <motion.div
            className="bg-gradient-pink rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: show ? 52 : 52, opacity: fade ? 0 : 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: 80, height: 80 }}
            onAnimationComplete={() => {
              if (show && !fade) setFade(true);
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
