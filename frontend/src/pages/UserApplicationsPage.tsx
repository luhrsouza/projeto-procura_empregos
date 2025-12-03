import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { jwtDecode } from 'jwt-decode';

interface Application {
  job_id: number;
  title: string;
  company: string;
  city: string;
  state: string;
  feedback: string | null;
}

export default function UserApplicationsPage() {
  const { apiUrl } = useApi();
  const token = localStorage.getItem('authToken');
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      const userId = decoded.sub || decoded.id || decoded.userId;
      
      axios.get(`${apiUrl}/users/${userId}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setApps(res.data.items))
      .catch(err => console.error("Erro ao buscar candidaturas", err));
    }
  }, [token, apiUrl]);

  return (
    <div className="container mt-5">
      <h1>Minhas Candidaturas</h1>
      
      {apps.length === 0 ? (
        <p>Você ainda não se candidatou a nenhuma vaga.</p>
      ) : (
        <div className="list-group mt-3">
          {apps.map(app => (
            <div key={app.job_id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{app.title}</h5>
                <small className="text-muted">{app.city} - {app.state}</small>
              </div>
              <p className="mb-1">Empresa: <strong>{app.company}</strong></p>
              
              <div className={`alert ${app.feedback ? 'alert-success' : 'alert-secondary'} mt-2`}>
                <strong>Status: </strong> 
                {app.feedback ? (
                    <span>Nova mensagem da empresa: <br/> <em>"{app.feedback}"</em></span>
                ) : (
                    "Aguardando análise da empresa..."
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}