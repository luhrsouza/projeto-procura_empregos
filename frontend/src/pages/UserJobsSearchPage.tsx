import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { jwtDecode } from 'jwt-decode';

interface Job {
  id: number;
  title: string;
  description: string;
  area: string;
  salary: number;
  state: string;
  city: string;
  company: { name: string } | string;
}

const AREAS_VALIDAS = [
  '',
  'Administração', 'Agricultura', 'Artes', 'Atendimento ao Cliente',
  'Comercial', 'Comunicação', 'Construção Civil', 'Consultoria',
  'Contabilidade', 'Design', 'Educação', 'Engenharia', 'Finanças',
  'Jurídica', 'Logística', 'Marketing', 'Produção', 'Recursos Humanos',
  'Saúde', 'Segurança', 'Tecnologia da Informação', 'Telemarketing',
  'Vendas', 'Outros'
];

export default function UserJobsSearchPage() {
  const { apiUrl } = useApi();
  const token = localStorage.getItem('authToken');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState({
    title: '',
    area: '',
    city: '',
    state: ''
  });

  const fetchJobs = async () => {
    try {
      const payload: any = {};
      if (filters.title) payload.title = filters.title;
      if (filters.area) payload.area = filters.area;
      if (filters.city) payload.city = filters.city;
      if (filters.state) payload.state = filters.state;

      const response = await axios.post(`${apiUrl}/jobs/search`, payload);
      setJobs(response.data);
    } catch (error) {
      console.log("Nenhuma vaga encontrada.");
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = async (jobId: number, jobTitle: string) => {
    if (!token) return alert("Faça login para se candidatar.");
    
    if (!confirm(`Deseja enviar seu currículo atual para a vaga "${jobTitle}"?`)) return;

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.sub || decoded.id || decoded.userId;

      const userRes = await axios.get(`${apiUrl}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userRes.data;

      const applyPayload = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        education: user.education || "Não informado",
        experience: user.experience || "Não informado"
      };

      await axios.post(`${apiUrl}/jobs/${jobId}`, applyPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Candidatura enviada com sucesso!");

    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao se candidatar.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Vagas Disponíveis</h1>
      
      <div className="card p-3 mb-4 bg-light">
        <div className="row g-3">
          <div className="col-md-3">
            <input name="title" className="form-control" placeholder="Título da vaga..." onChange={handleFilterChange} />
          </div>
          <div className="col-md-3">
            <select name="area" className="form-select" onChange={handleFilterChange}>
              <option value="">Todas as Áreas</option>
              {AREAS_VALIDAS.map(area => area && <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <input name="city" className="form-control" placeholder="Cidade" onChange={handleFilterChange} />
          </div>
          <div className="col-md-2">
            <input name="state" className="form-control" placeholder="UF" maxLength={2} onChange={handleFilterChange} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={fetchJobs}>Filtrar</button>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-muted">Nenhuma vaga encontrada com esses filtros.</p>
      ) : (
        <div className="row">
          {jobs.map(job => (
            <div key={job.id} className="col-md-6 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {typeof job.company === 'string' ? job.company : job.company?.name} | {job.area}
                  </h6>
                  <p className="card-text text-truncate">{job.description}</p>
                  <p className="small mb-1"><strong>Local:</strong> {job.city} - {job.state}</p>
                  <p className="small"><strong>Salário:</strong> {job.salary ? `R$ ${job.salary}` : 'A combinar'}</p>
                  
                  <button 
                    onClick={() => handleApply(job.id, job.title)}
                    className="btn btn-success w-100 mt-2"
                  >
                    Candidatar-se
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}