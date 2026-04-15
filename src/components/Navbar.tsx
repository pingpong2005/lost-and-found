import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Home, List, LogIn, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth, loginWithGoogle } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Navbar() {
  const location = useLocation();
  const [user] = useAuthState(auth);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/items', label: 'All Items', icon: List },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/add', label: 'Report Item', icon: PlusCircle },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-6 py-3 flex items-center gap-8 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-muted hover:text-primary"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
      
      <button
        onClick={() => user ? auth.signOut() : loginWithGoogle()}
        className="flex flex-col items-center gap-1 text-muted hover:text-primary transition-all duration-200"
      >
        {user ? <User size={20} /> : <LogIn size={20} />}
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {user ? 'Sign Out' : 'Sign In'}
        </span>
      </button>
    </nav>
  );
}
