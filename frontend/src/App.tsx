import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useApi } from './contexts/ApiContext';

function App() {
  const navigate = useNavigate();
  const { apiUrl } = useApi();
  const token = localStorage.getItem('authToken');

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Erro no logout do servidor, mas deslogando no cliente.", error);
    } finally {
      localStorage.removeItem('authToken');
      alert('Você foi deslogado com sucesso.');
      navigate('/login');
      window.location.reload();
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
            <Link to="/register">Cadastro</Link>
          </>
        ) : (
          <>
            | <Link to="/profile">Perfil</Link> |{' '}
            <button onClick={handleLogout} style={{background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>Logout</button>
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

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;