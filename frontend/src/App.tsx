import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useApi } from './contexts/ApiContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import CompanyRegisterPage from './pages/CompanyRegisterPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import CompanyJobsPage from './pages/CompanyJobsPage';
import CompanyJobCreatePage from './pages/CompanyJobCreatePage';
import CompanyJobEditPage from './pages/CompanyJobEditPage';
import UserJobsSearchPage from './pages/UserJobsSearchPage';
import CompanyJobCandidatesPage from './pages/CompanyJobCandidatesPage';

import ProtectedRoute from './components/ProtectedRoute';
import CompanyProtectedRoute from './components/CompanyProtectedRoute';

interface TokenPayload {
  role: 'user' | 'company';
}

function App() {
  const navigate = useNavigate();
  const { apiUrl } = useApi();
  const token = localStorage.getItem('authToken');
  
  const [userRole, setUserRole] = useState<'user' | 'company' | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(token);
        setUserRole(decodedToken.role);
      } catch (e) {
        localStorage.removeItem('authToken');
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erro no logout do servidor, mas deslogando no cliente.", error);
    } finally {
      localStorage.removeItem('authToken');
      setUserRole(null);
      alert('Você foi deslogado com sucesso.');
      navigate('/login');
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Configurações</Link> |{' '}
        <Link to="/home">Início</Link>
        {!token ? (
          <>
            | <Link to="/login">Login</Link> |{' '}
            <Link to="/register">Cadastro (Usuário)</Link> |{' '}
            <Link to="/company/register">Cadastro (Empresa)</Link>
          </>
        ) : (
          <>
            {userRole === 'user' && (
             <>
              <Link to="/profile">Meu Perfil</Link> |{' '}
              <Link to="/jobs">Buscar Vagas</Link>
             </>
            )}
            {userRole === 'company' && (
             <>
              <Link to="/company/profile">Painel da Empresa</Link> |{' '}
              <Link to="/company/jobs">Gerenciar Vagas</Link>
             </>
            )}
            | <button onClick={handleLogout} style={{background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>Logout</button>
          </>
        )}
      </nav>
      <hr />
      <main>
        <Routes>
          <Route path="/" element={<SettingsPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/company/register" element={<CompanyRegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/jobs" element={<UserJobsSearchPage />} />
          </Route>

          <Route element={<CompanyProtectedRoute />}>
            <Route path="/company/profile" element={<CompanyProfilePage />} />
            <Route path="/company/jobs" element={<CompanyJobsPage />} />
            <Route path="/company/jobs/create" element={<CompanyJobCreatePage />} />
            <Route path="/company/jobs/edit/:id" element={<CompanyJobEditPage />} />
            <Route path="/company/jobs/:id/candidates" element={<CompanyJobCandidatesPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;