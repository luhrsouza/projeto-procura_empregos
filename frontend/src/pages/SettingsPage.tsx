import { useState } from 'react';
import { useApi } from '../contexts/ApiContext';

export default function SettingsPage() {
  const { apiUrl, setApiUrl } = useApi();
  const [tempUrl, setTempUrl] = useState(apiUrl);

  const handleSave = () => {
    setApiUrl(tempUrl);
    alert(`Endereço da API salvo como: ${tempUrl}`);
  };

  return (
    <div>
      <h1>Configurações da API</h1>
      <p>Digite o endereço base do servidor que você deseja usar (ex: http://192.168.0.10:3000).</p>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          placeholder="http://localhost:3000"
          style={{ width: '300px' }}
        />
        <button onClick={handleSave}>Salvar</button>
      </div>
      <p>Endereço atual: <strong>{apiUrl}</strong></p>
    </div>
  );
}