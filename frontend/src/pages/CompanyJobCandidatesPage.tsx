import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApi } from '../contexts/ApiContext';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Candidate {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
}

export default function CompanyJobCandidatesPage() {
  const { apiUrl } = useApi();
  const { id } = useParams();
  const token = localStorage.getItem('authToken');
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, [id]);

  const fetchCandidates = async () => {
    try {
      if (!token) return;
      const decoded: any = jwtDecode(token);
      const companyId = decoded.sub || decoded.id || decoded.company_id;

      const response = await axios.get(`${apiUrl}/companies/${companyId}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCandidates(response.data.items);
    } catch (error) {
      console.error("Erro ao buscar candidatos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async (userId: number, userName: string) => {
    const message = prompt(`Digite o feedback para ${userName}:`);
    if (!message) return;

    try {
      await axios.post(`${apiUrl}/jobs/${id}/feedback`, {
        user_id: userId,
        message: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Feedback enviado com sucesso!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao enviar feedback.");
    }
  };

  if (loading) return <p>Carregando candidatos...</p>;

  return (
    <div className="container mt-5">
      <h1>Candidatos da Vaga #{id}</h1>
      
      {candidates.length === 0 ? (
        <p>Ainda não há candidatos para esta vaga.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Nome</th>
              <th>Email / Telefone</th>
              <th>Currículo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.user_id}>
                <td>{c.name}</td>
                <td>
                  {c.email}<br/>
                  <small>{c.phone}</small>
                </td>
                <td>
                  <strong>Formação:</strong> {c.education}<br/>
                  <strong>Experiência:</strong> {c.experience}
                </td>
                <td>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSendFeedback(c.user_id, c.name)}
                  >
                    Enviar Feedback
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