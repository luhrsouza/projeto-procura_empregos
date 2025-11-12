import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: number;
  username: string;
  role: 'user' | 'company';
}

export default function LoginPage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });

      // --- LOG DO JSON RECEBIDO (SUCESSO) ---
      console.log('<< [SERVIDOR -> CLIENTE] Resposta Recebida:', response.data);

      if (response.status === 200) {
        const { token } = response.data;

        localStorage.setItem('authToken', token);

        const decodedToken = jwtDecode<TokenPayload>(token);
        const userRole = decodedToken.role;


        alert('Login realizado com sucesso!');

        if (userRole === 'user') {
          navigate('/profile');
        } else if (userRole === 'company') {
          navigate('/company/profile');
        } else {
          navigate('/home'); 
        }
        
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError(err.response.data.message);
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente.');
        }
      } else {
        setError('Ocorreu um erro de conexão. Verifique o servidor.');
      }
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de Usuário"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}