import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string | number;
  username: string;
  role: 'user' | 'company';
}

const CompanyProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode<TokenPayload>(token);
    const userRole = decodedToken.role;

    if (userRole !== 'company') {
      alert('Acesso negado. Esta área é restrita para empresas.');
      return <Navigate to="/profile" replace />;
    }

    return <Outlet />;

  } catch (error) {
    console.error("Token inválido ou expirado:", error);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default CompanyProtectedRoute;