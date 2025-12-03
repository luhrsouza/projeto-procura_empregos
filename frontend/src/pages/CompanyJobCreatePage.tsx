import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { useNavigate } from 'react-router-dom';

const AREAS_VALIDAS = [
  'Administração', 'Agricultura', 'Artes', 'Atendimento ao Cliente',
  'Comercial', 'Comunicação', 'Construção Civil', 'Consultoria',
  'Contabilidade', 'Design', 'Educação', 'Engenharia', 'Finanças',
  'Jurídica', 'Logística', 'Marketing', 'Produção', 'Recursos Humanos',
  'Saúde', 'Segurança', 'Tecnologia da Informação', 'Telemarketing',
  'Vendas', 'Outros'
];

export default function CompanyJobCreatePage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: 'Outros',
    state: '',
    city: '',
    salary: 0
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, salary: Number(formData.salary) };
      
      await axios.post(`${apiUrl}/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Vaga criada com sucesso!");
      navigate('/company/jobs');
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar vaga");
    }
  };

  return (
    <div>
      <h1>Nova Vaga</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <input name="title" placeholder="Título" onChange={handleChange} required />
        
        <textarea name="description" placeholder="Descrição" onChange={handleChange} required rows={4} />
        
        <label>Área:</label>
        <select name="area" onChange={handleChange} value={formData.area}>
            {AREAS_VALIDAS.map(area => <option key={area} value={area}>{area}</option>)}
        </select>

        <input name="state" placeholder="Estado (Ex: PR)" onChange={handleChange} maxLength={2} required />
        <input name="city" placeholder="Cidade" onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salário (Opcional)" onChange={handleChange} step="0.01" />

        <button type="submit">Cadastrar Vaga</button>
      </form>
    </div>
  );
}