
    import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/context/AuthContext';
    import { useToast } from '@/components/ui/use-toast';

    const ProtectedRoute = ({ children }) => {
      const { user } = useAuth();
      const location = useLocation();
      const { toast } = useToast();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      return children;
    };

    export default ProtectedRoute;
  