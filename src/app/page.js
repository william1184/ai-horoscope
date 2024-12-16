'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [signs, setSigns] = useState([]);
  const [sign, setSign] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add stars to the background
  useEffect(() => {
    const createStars = () => {
      const starContainer = document.querySelector('.stars');
      const starCount = 20; // Number of stars

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`; // Random position on Y-axis
        star.style.left = `${Math.random() * 100}%`; // Random position on X-axis
        starContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  // Fetch signs from the API
  useEffect(() => {
    const fetchSigns = async () => {
      try {
        const res = await fetch('/api/signs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const response = await res.json();
        setSigns(response.data.signs); // Assuming the API returns { signs: [...] }
      } catch (error) {
        console.error('Error fetching signs:', error);
      }
    };

    fetchSigns();
  }, []);

  const handleSignClick = async (id) => {
    setSign(`${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/signs/${sign}/prediction`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSign('');
    setResponse(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="hidden"
        value={sign}
        onChange={(e) => setSign(e.target.value)}
      />
      <div className="flex flex-col items-center justify-center p-4 min-h-screen relative overflow-hidden">
        {/* Starry background */}
        <div className="absolute inset-0 stars"></div>

        <h1 className="text-2xl font-mono font-extrabold text-white mb-6 text-center leading-relaxed animate-fade-in">
          Quer dar uma espiadinha no futuro?
          <br />
          <span className="text-lg font-medium">
            Descubra o que o aguarda hoje. <br></br> Selecione seu signo e embarque nessa jornada astral!
          </span>
        </h1>
        <br></br>

        {!loading && !response && (
          <div className="relative w-96 h-96">
            {signs.map(({ id, name, icon }, index) => {
              const radius = 45; // Define a mesma distância para ambos os eixos
              const angle = (index / signs.length) * 2 * Math.PI; // Calculate angle for each button
              const x = 50 + radius * Math.cos(angle); // X position
              const y = 50 + radius * Math.sin(angle); // Y position

              return (
                <button
                  key={id}
                  onClick={() => handleSignClick(id)}
                  style={{
                    position: 'absolute',
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="bg-white hover:bg-blue-400 font-bold py-2 px-4 rounded-full"
                  title={name} // Tooltip com o nome do signo
                >
                  <span style={{ fontSize: '1.5em' }}>{icon}</span> {/* Aumenta o tamanho do ícone */}
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="mt-6 text-white text-lg animate-pulse">
            🔮 Consultando os astros...
          </div>
        )}

        {response && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-center text-2xl font-mono text-blue-600 mb-4">Sua previsão:</h2>
            <pre className="text-center text-xl text-gray-700 whitespace-pre-wrap">{response.response}</pre>
          </div>
        )}
        <br></br>
        {response && (
          <button
            onClick={() => resetForm()}
            className="bg-white hover:bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
        )}
      </div>
    </form>
  );
}