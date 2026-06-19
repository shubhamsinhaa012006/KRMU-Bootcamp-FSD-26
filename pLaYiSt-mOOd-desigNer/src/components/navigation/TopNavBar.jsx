import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Music, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/playlists', label: 'All Playlists' }
];

export const TopNavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <Music size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              MoodDesigner
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-white ${
                    isActive ? 'text-white' : 'text-neutral-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            <button className="flex items-center justify-center p-2 rounded-full bg-surface hover:bg-neutral-800 transition-colors border border-white/5">
              <User size={18} className="text-neutral-300" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-neutral-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-surface border-l border-white/10 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-bold">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white bg-white/5 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium transition-colors ${
                        isActive ? 'text-primary' : 'text-neutral-300'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
