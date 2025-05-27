
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { AlertTriangle, Home } from 'lucide-react';

    const NotFoundPage = () => {
      return (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center px-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
          >
            <AlertTriangle className="w-24 h-24 text-destructive mb-8" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4">
            404
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-3">Oops! Page Not Found.</p>
          <p className="text-lg text-muted-foreground mb-10 max-w-md">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Link>
            </Button>
          </motion.div>
           <img  class="mt-12 w-full max-w-lg mx-auto opacity-80" alt="Lost astronaut floating in space" src="https://images.unsplash.com/photo-1695088560164-84c9c42bbadd" />
        </motion.div>
      );
    };

    export default NotFoundPage;
  