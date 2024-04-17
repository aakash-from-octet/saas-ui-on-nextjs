import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
  children?: ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token: string = sessionStorage.getItem('accessToken') || '';
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
