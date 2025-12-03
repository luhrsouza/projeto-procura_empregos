import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Job {
  id: number;
  title: string;
  area: string;
  state: string;
  city: string;
  company: { id: number; name: string } | string;
}

export default function CompanyJobsPage() {
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const token = localStorage.getItem('authToken');
  const [companyId, setCompanyId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      const id = decoded.sub || decoded.id || decoded.company_id;
      setCompanyId(id);
      fetchJobs(id);
    }
  }, [token]);

  const fetchJobs = async (id: number) => {
    try {
      const response = await axios.post(`${apiUrl}/jobs/search`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const myJobs = response.data.filter((job: any) => {
        if (typeof job.company === 'object') {
            return job.company.id === id;
        }
        return false;
      });
      
      setJobs(myJobs);
    } catch (error) {
      console.log("Nenhuma vaga encontrada ou erro na busca.");
      setJobs([]);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Tem certeza que deseja apagar esta vaga?")) return;
    try {
      await axios.delete(`${apiUrl}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Vaga apagada com sucesso!");
      if (companyId) fetchJobs(companyId);
    } catch (error) {
      alert("Erro ao apagar vaga.");
    }
  };

  return (
    <div className="container mt-5">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Minhas Vagas</h1>
        <Link to="/company/jobs/create">
            <button style={{ backgroundColor: 'green', color: 'white' }}>+ Nova Vaga</button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p>Você ainda não cadastrou nenhuma vaga.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Título</th>
              <th>Área</th>
              <th>Local</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.title}</td>
                <td>{job.area}</td>
                <td>{job.city} - {job.state}</td>
                <td>
                  <button 
                    onClick={() => navigate(`/company/jobs/edit/${job.id}`)}
                    style={{ marginRight: '10px', backgroundColor: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}