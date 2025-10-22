import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';

export default function RegisterPage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const userData = {
      name,
      username,
      password,
      ...(email && { email }),
      ...(phone && { phone }),
      ...(experience && { experience }),
      ...(education && { education }),
    };

    // --- LOG DO JSON ENVIADO ---
    console.log('>> [CLIENTE -> SERVIDOR] Enviando JSON:', userData);

    try {
      const response = await axios.post(`${apiUrl}/users`, userData);
      // --- LOG DO JSON RECEBIDO (SUCESSO) ---
      console.log('<< [SERVIDOR -> CLIENTE] Resposta Recebida:', response.data);

      if (response.status === 201) {
        alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
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
          setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
        }
      } else {
        setError('Ocorreu um erro de conexão. Verifique o endereço do servidor e se ele está online.');
      }
    }
  };

  return (
    <div>
      <h1>Página de Cadastro</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo*" required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nome de Usuário*" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha*" required />
        
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (opcional)" />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefone (opcional)" />
        <textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Experiência (opcional)" />
        <textarea value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Formação (opcional)" />

        {error && <pre style={{ color: 'red', border: '1px solid red', padding: '10px', whiteSpace: 'pre-wrap' }}>{error}</pre>}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}