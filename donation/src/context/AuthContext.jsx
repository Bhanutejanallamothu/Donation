
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext();

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useLocalStorage('hopefund-user', null);
      const [users, setUsers] = useLocalStorage('hopefund-users', []); 
      const { toast } = useToast();

      const login = (email, password) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          setUser({ email: foundUser.email, name: foundUser.name });
          toast({
            title: "Login Successful",
            description: `Welcome back, ${foundUser.name}!`,
          });
          return true;
        }
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      };

      const register = (name, email, password) => {
        if (users.find(u => u.email === email)) {
          toast({
            title: "Registration Failed",
            description: "An account with this email already exists.",
            variant: "destructive",
          });
          return false;
        }
        const newUser = { name, email, password }; 
        setUsers(prevUsers => [...prevUsers, newUser]);
        setUser({ email: newUser.email, name: newUser.name });
        toast({
          title: "Registration Successful",
          description: `Welcome, ${name}! Your account has been created.`,
        });
        return true;
      };

      const logout = () => {
        setUser(null);
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
      };

      return (
        <AuthContext.Provider value={{ user, users, login, register, logout }}>
          {children}
        </AuthContext.Provider>
      );
    };
  