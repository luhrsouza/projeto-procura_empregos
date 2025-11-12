import { useEffect, useState} from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface CompanyProfile {
  name: string;
  business: string;
  username: string;
  street: string;
  number: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

interface TokenPayload {
  sub: string;
  username: string;
  role: 'user' | 'company';
  iat: number;
  exp: number;
}

interface CompanyFormData {
  name: string;
  business: string;
  street: string;
  number: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password?: string;
}

export default function CompanyProfilePage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  

  const [originalUsername, setOriginalUsername] = useState('');

  const [formData, setFormData] = useState<CompanyFormData | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Você não está logado.');
        return;
      }

      try {
        const decodedToken = jwtDecode<TokenPayload>(token);
        
        const payload = decodedToken as any;
        const id = payload.sub || payload.id || payload.company_id;
        setCompanyId(id);

        console.log('ID extraído:', id);

        if (!id) {
          setError('Não foi possível obter o ID da empresa a partir do token.');
          return;
        }

        const response = await axios.get(`${apiUrl}/companies/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          ...response.data,
          password: '',
        });
        setOriginalUsername(response.data.username);

      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message);
        } else {
          setError('Falha ao buscar os dados do perfil da empresa.');
        }
        console.error(err);
      }
    };

    fetchCompanyProfile();
  }, [apiUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('authToken');

    if (!formData || !companyId || !token) {
      setError('Não foi possível carregar os dados para atualização.');
      return;
    }

    const updateData = {
      name: formData.name,
      business: formData.business,
      email: formData.email,
      phone: formData.phone,
      street: formData.street,
      number: formData.number,
      city: formData.city,
      state: formData.state,
      ...(formData.password && { password: formData.password }),
    };

    try {
      const response = await axios.patch(`${apiUrl}/companies/${companyId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setFormData(prev => (prev ? {...prev, password: ''} : null));
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (err.response.status === 401 || err.response.status === 403 || err.response.status === 404) {
          setError(data.message);
        } else if (err.response.status === 422) {
          const errorDetails = data.details.map((detail: any) => `- ${detail.error}`).join('\n');
          setError(`Erro de validação:\n${errorDetails}`);
        } else {
          setError('Ocorreu um erro inesperado.');
        }
      } else {
        setError('Erro de conexão com o servidor.');
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Você tem CERTEZA que deseja deletar sua conta? Esta ação não pode ser desfeita e todas as suas vagas serão perdidas.')) {
      return;
    }

    setError('');
    setSuccessMessage('');
    const token = localStorage.getItem('authToken');

    if (!companyId || !token) {
      setError('Não foi possível identificar a conta para exclusão.');
      return;
    }

    try {
      const response = await axios.delete(`${apiUrl}/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        localStorage.removeItem('authToken');
        alert('Sua conta foi deletada com sucesso.');
        navigate('/login');
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        setError(data.message);
      } else {
        setError('Erro de conexão com o servidor.');
      }
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!formData) return <p>Carregando perfil da empresa...</p>;

  return (
    <div>
      <h1>Painel da Empresa: {originalUsername}</h1>
      <p>Edite os dados da sua empresa. O nome de usuário não pode ser alterado.</p>
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <label>Nome da Empresa:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        
        <label>Ramo:</label>
        <input type="text" name="business" value={formData.business} onChange={handleChange} required />
        
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <label>Telefone:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        
        <label>Rua:</label>
        <input type="text" name="street" value={formData.street} onChange={handleChange} required />
        
        <label>Número:</label>
        <input type="text" name="number" value={formData.number} onChange={handleChange} required />
        
        <label>Cidade:</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        
        <label>Estado (Sigla):</label>
        <input type="text" name="state" value={formData.state} onChange={handleChange} required maxLength={2} />
        
        <label>Nova Senha (deixe em branco para não alterar):</label>
        <input type="password" name="password" value={formData.password || ''} onChange={handleChange} />

        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {error && <pre style={{ color: 'red', border: '1px solid red', padding: '10px', whiteSpace: 'pre-wrap' }}>{error}</pre>}

        <button type="submit">Salvar Alterações</button>
      </form>
      <hr style={{ margin: '30px 0' }} />
      <div style={{ border: '2px solid red', padding: '15px', borderRadius: '8px' }}>
        <h2>Deletar Conta</h2>
        <p>Esta ação é permanente e não pode ser desfeita. Se você tiver vagas ativas, a exclusão será bloqueada (Erro 409), conforme o protocolo.</p>
        <button 
          onClick={handleDelete} 
          style={{ backgroundColor: '#D9534F', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Deletar Minha Conta Permanentemente
        </button>
      </div>
    </div>
  );
}