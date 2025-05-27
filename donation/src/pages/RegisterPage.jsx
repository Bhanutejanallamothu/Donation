
    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '@/context/AuthContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { motion } from 'framer-motion';
    import { UserPlus, Mail, Lock, User } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const RegisterPage = () => {
      const navigate = useNavigate();
      const { register } = useAuth();
      const { toast } = useToast();
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast({
            title: "Passwords do not match",
            description: "Please ensure your passwords match.",
            variant: "destructive",
          });
          return;
        }
        if (password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        try {
          const success = register(name, email, password);
          if (success) {
             setTimeout(() => {
                navigate('/');
             }, 1000);
          }
        } catch (error) {
          toast({
            title: "Registration Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
      };

      const inputMotionProps = {
        whileHover: { scale: 1.02 },
        whileFocus: { scale: 1.02, boxShadow: "0px 0px 8px rgba(var(--primary-rgb), 0.5)" }
      };

      return (
        <motion.div 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12"
        >
          <Card className="w-full max-w-md professional-card shadow-2xl">
            <CardHeader className="text-center">
               <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.1, type:'spring', stiffness:150}} className="inline-block mx-auto p-4 bg-primary/10 rounded-full mb-4">
                  <UserPlus className="h-10 w-10 text-primary" />
               </motion.div>
              <CardTitle className="text-3xl font-bold gradient-text">Create an Account</CardTitle>
              <CardDescription className="text-lg text-foreground/70">Join HopeFund to support and create campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                   <motion.div {...inputMotionProps} className="relative flex items-center">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 professional-input"
                    />
                  </motion.div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <motion.div {...inputMotionProps} className="relative flex items-center">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 professional-input"
                    />
                  </motion.div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <motion.div {...inputMotionProps} className="relative flex items-center">
                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="•••••••• (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 professional-input"
                    />
                  </motion.div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                   <motion.div {...inputMotionProps} className="relative flex items-center">
                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 professional-input"
                    />
                  </motion.div>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="pt-2">
                    <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="text-center block">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default RegisterPage;
  