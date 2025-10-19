import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string | null;
  phone: string | null;
  experience: string | null;
  education: string | null;
}

export default function ProfilePage() {
  const { apiUrl } = useApi();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Você não está logado.');
        return;
      }

      try {
        const decodedToken: { sub: number } = jwtDecode(token);
        const userId = decodedToken.sub;

        const response = await axios.get(`${apiUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError('Falha ao buscar os dados do perfil.');
        console.error(err);
      }
    };

    fetchUserProfile();
  }, [apiUrl]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Carregando perfil...</p>;

  return (
    <div>
      <h1>Perfil de Usuário</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email || 'Não informado'}</p>
      <p><strong>Telefone:</strong> {user.phone || 'Não informado'}</p>
      <p><strong>Experiência:</strong> {user.experience || 'Não informada'}</p>
      <p><strong>Formação:</strong> {user.education || 'Não informada'}</p>
    </div>
  );
}