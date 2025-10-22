import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: '',
    education: '',
  });

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
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);

        setFormData({
          name: response.data.name,
          email: response.data.email || '',
          password: '',
          phone: response.data.phone || '',
          experience: response.data.experience || '',
          education: response.data.education || '',
        });
      } catch (err) {
        setError('Falha ao buscar os dados do perfil.');
        console.error(err);
      }
    };

    fetchUserProfile();
  }, [apiUrl]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    const token = localStorage.getItem('authToken');
    if (!user || !token) return;

    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      experience: formData.experience,
      education: formData.education,
      ...(formData.password && { password: formData.password }),
    };

    console.log('>> [CLIENTE -> SERVIDOR] Enviando JSON:', updateData);

    try {
      await axios.patch(`${apiUrl}/users/${user.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Falha ao atualizar o perfil. Verifique os dados e tente novamente.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Você tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!user || !token) return;

    try {
      await axios.delete(`${apiUrl}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('authToken');
      alert('Sua conta foi deletada com sucesso.');
      navigate('/login');
      window.location.reload();
    } catch (err) {
      setError('Falha ao deletar a conta.');
      console.error(err);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Carregando perfil...</p>;

  return (
    <div>
      <h1>Perfil de {user.username}</h1>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <label>Nome:</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

        <label>Nova Senha (deixe em branco para não alterar):</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} />

        <label>Telefone:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />

        <label>Experiência:</label>
        <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows={4} />

        <label>Formação:</label>
        <textarea name="education" value={formData.education} onChange={handleInputChange} rows={4} />

        <button type="submit">Salvar Alterações</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <div>
        <h2>Deletar Conta</h2>
        <p>Esta ação é permanente e não pode ser desfeita.</p>
        <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Deletar Minha Conta</button>
      </div>
    </div>
  );
}