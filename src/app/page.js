'use client'
import { useState } from 'react';

const signs = [
  { name: 'Áries', icon: '♈' },
  { name: 'Touro', icon: '♉' },
  { name: 'Gêmeos', icon: '♊' },
  { name: 'Câncer', icon: '♋' },
  { name: 'Leão', icon: '♌' },
  { name: 'Virgem', icon: '♍' },
  { name: 'Libra', icon: '♎' },
  { name: 'Escorpião', icon: '♏' },
  { name: 'Sagitário', icon: '♐' },
  { name: 'Capricórnio', icon: '♑' },
  { name: 'Aquário', icon: '♒' },
  { name: 'Peixes', icon: '♓' },
];

export default function Home() {
  const [sign, setSign] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignClick = async (sign) => {
    setSign(`${sign}`);
  };

  const handleSubmit = async (e) => {
    setLoading(true);

    try {
      const res = await fetch('/api/horoscopes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sign: sign }),
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
    setSign("")
    setResponse(null)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-mono font-extrabold text-white mb-6 text-center leading-relaxed animate-fade-in">
        Quer dar uma espiadinha no futuro?
        <br />
        <span className="text-lg font-medium">
          Descubra o que o aguarda hoje. <br></br> Selecione seu signo e embarque nessa jornada astral!
        </span>
      </h1>

      {!loading && !response && (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl font-mono mb-4">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {signs.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => handleSignClick(name)}
                className="bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-2 rounded"
              >
                {icon} {name}
              </button>
            ))}
          </div>

          <input
            type="hidden"
            value={sign}
            onChange={(e) => setSign(e.target.value)}
            placeholder="Digite seu signo ou pergunta"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>
      )}
      {loading && (
        <div className="mt-6 text-white text-lg animate-pulse">
          🔮 Consultando os astros...
        </div>
      )}

      {response && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-center text-2xl font-mono text-purple-600 mb-4">Sua previsão:</h2>
          <pre className="text-center text-xl text-gray-700 whitespace-pre-wrap">{response.response}</pre>
        </div>
      )}
      <br></br>
      {response && (
        <button
          onClick={() => resetForm()}
          className="bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-4 rounded"
        >
          Voltar
        </button>
      )}
    </div>
  );
}