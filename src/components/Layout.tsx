import { ReactNode } from 'react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen pb-32">
      <header className="pt-12 pb-8 px-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Lost & Found</h1>
        <p className="text-muted text-sm uppercase tracking-[0.2em]">Community Portal</p>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navbar />
    </div>
  );
}
