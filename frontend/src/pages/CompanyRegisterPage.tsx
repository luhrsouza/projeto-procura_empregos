import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';

export default function CompanyRegisterPage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    business: '',
    username: '',
    password: '',
    street: '',
    number: '',
    city: '',
    state: '',
    phone: '',
    email: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/companies`, formData);

      if (response.status === 201) {
        alert('Empresa cadastrada com sucesso! Você será redirecionado para a página de login.');
        navigate('/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (err.response.status === 409) {
          setError(data.message);
        } else if (err.response.status === 422) {
          const errorDetails = data.details.map((detail: any) => `- ${detail.error}`).join('\n');
          setError(`Erro de validação:\n${errorDetails}`);
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
      <h1>Cadastro de Empresa</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome da Empresa*" required />
        <input type="text" name="business" value={formData.business} onChange={handleChange} placeholder="Ramo*" required />
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Nome de Usuário*" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha*" required />
        <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Rua*" required />
        <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Número*" required />
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Cidade*" required />
        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Estado (sigla, ex: PR)*" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone (só números)*" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email*" required />

        {error && <pre style={{ color: 'red', border: '1px solid red', padding: '10px', whiteSpace: 'pre-wrap' }}>{error}</pre>}

        <button type="submit">Cadastrar Empresa</button>
      </form>
    </div>
  );
}