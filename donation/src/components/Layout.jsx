
    import React from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { FolderHeart as HandHeart, PlusSquare, ListChecks, Home, LogIn, UserPlus, LogOut, Linkedin, Github, Twitter, Gift } from 'lucide-react';
    import { useAuth } from '@/context/AuthContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';

    const Layout = ({ children }) => {
      const location = useLocation();
      const navigate = useNavigate();
      const { user, logout } = useAuth();

      const navItems = [
        { name: 'Home', path: '/', icon: Home, public: true },
        { name: 'Campaigns', path: '/campaigns', icon: ListChecks, public: true },
        { name: 'Create Campaign', path: '/create-campaign', icon: PlusSquare, public: false },
        { name: 'My Donations', path: '/my-donations', icon: Gift, public: false}
      ];

      const handleLogout = () => {
        logout();
        navigate('/');
      };

      return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <header className="sticky top-0 z-50 shadow-md bg-card/95 backdrop-blur-lg border-b border-border">
            <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
              <Link to="/" className="text-2xl sm:text-3xl font-bold gradient-text flex items-center">
                <HandHeart className="mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                HopeFund
              </Link>
              <ul className="flex space-x-3 sm:space-x-6 items-center">
                {navItems.filter(item => item.public || user).map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`text-base sm:text-lg font-medium transition-colors duration-300 hover:text-primary ${
                        location.pathname === item.path ? 'text-primary font-semibold scale-105' : 'text-foreground/80'
                      }`}
                    >
                      <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <item.icon className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">{item.name}</span>
                      </motion.div>
                    </Link>
                  </li>
                ))}
                {!user ? (
                  <>
                    <li>
                      <Button variant="ghost" asChild className={`text-base sm:text-lg font-medium transition-colors duration-300 hover:text-primary ${location.pathname === '/login' ? 'text-primary font-semibold' : 'text-foreground/80'}`}>
                        <Link to="/login">
                          <LogIn className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> <span className="hidden sm:inline">Login</span>
                        </Link>
                      </Button>
                    </li>
                    <li>
                      <Button variant="default" size="sm" asChild className="text-sm sm:text-base">
                         <Link to="/register">
                           <UserPlus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Register
                         </Link>
                      </Button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Button onClick={handleLogout} variant="outline" size="sm" className="text-sm sm:text-base text-foreground/80 hover:text-primary hover:border-primary">
                      <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <LogOut className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Logout
                      </motion.div>
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </header>

          <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </main>

          <footer className="bg-card border-t border-border py-12 text-foreground/70">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">HopeFund</h3>
                  <p className="text-sm">Connecting hearts, inspiring hope. Support causes that matter.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                    <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                    <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Linkedin size={24} /></a>
                    <a href="https://github.com/hostinger" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Github size={24} /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Twitter size={24} /></a>
                  </div>
                  <p className="text-sm mt-4">Subscribe for updates on new campaigns:</p>
                  <form className="mt-2 flex">
                    <Input type="email" placeholder="your@email.com" className="text-sm professional-input rounded-r-none flex-grow" />
                    <Button type="submit" variant="default" className="rounded-l-none text-sm">Subscribe</Button>
                  </form>
                </div>
              </div>
              <div className="border-t border-border pt-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} HopeFund Inc. All rights reserved.</p>
                <p>Powered by <a href="https://hostinger.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary font-medium">Hostinger</a> & Horizons AI</p>
              </div>
            </div>
          </footer>
        </div>
      );
    };

    export default Layout;
  