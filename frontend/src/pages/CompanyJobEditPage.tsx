import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { useNavigate, useParams } from 'react-router-dom';

const AREAS_VALIDAS = [
  'Administração', 'Agricultura', 'Artes', 'Atendimento ao Cliente',
  'Comercial', 'Comunicação', 'Construção Civil', 'Consultoria',
  'Contabilidade', 'Design', 'Educação', 'Engenharia', 'Finanças',
  'Jurídica', 'Logística', 'Marketing', 'Produção', 'Recursos Humanos',
  'Saúde', 'Segurança', 'Tecnologia da Informação', 'Telemarketing',
  'Vendas', 'Outros'
];

export default function CompanyJobEditPage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('authToken');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    state: '',
    city: '',
    salary: 0
  });

  useEffect(() => {
    axios.get(`${apiUrl}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        const data = res.data;
        setFormData({
            title: data.title,
            description: data.description,
            area: data.area,
            state: data.state,
            city: data.city,
            salary: data.salary
        });
    })
    .catch(() => alert("Erro ao carregar vaga"));
  }, [id, apiUrl, token]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, salary: Number(formData.salary) };
      
      await axios.patch(`${apiUrl}/jobs/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Vaga atualizada com sucesso!");
      navigate('/company/jobs');
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao atualizar vaga");
    }
  };

  return (
    <div>
      <h1>Editar Vaga #{id}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Título" required />
        
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição" required rows={4} />
        
        <select name="area" value={formData.area} onChange={handleChange}>
            {AREAS_VALIDAS.map(area => <option key={area} value={area}>{area}</option>)}
        </select>

        <input name="state" value={formData.state} onChange={handleChange} placeholder="Estado" maxLength={2} required />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="Cidade" required />
        <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salário" step="0.01" />

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}