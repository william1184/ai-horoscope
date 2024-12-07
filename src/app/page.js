'use client'
import { useState } from 'react';

const signs = [
  { name: 'Aries', icon: '♈' },
  { name: 'Taurus', icon: '♉' },
  { name: 'Gemini', icon: '♊' },
  { name: 'Cancer', icon: '♋' },
  { name: 'Leo', icon: '♌' },
  { name: 'Virgo', icon: '♍' },
  { name: 'Libra', icon: '♎' },
  { name: 'Scorpio', icon: '♏' },
  { name: 'Sagittarius', icon: '♐' },
  { name: 'Capricorn', icon: '♑' },
  { name: 'Aquarius', icon: '♒' },
  { name: 'Pisces', icon: '♓' },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignClick = async (sign) => {
    setPrompt(`${sign}`);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    
    try {
      const res = await fetch('/api/horoscopes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sign: prompt }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-mono font-extrabold text-white mb-6 text-center leading-relaxed animate-fade-in">
        Want to peek into the future?
        <br />
        <span className="text-lg font-medium">
          Unveil the mysteries of the universe and find out what awaits you today.
          Enter your data and embark on this astral journey!
        </span>
      </h1>



      {!loading && !response && (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl font-mono mb-4">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {signs.map(({name, icon}) => (
              <button
                key={name}
                onClick={() => handleSignClick(name)}
                className="bg-purple-200 hover:bg-purple-300 text-purple-700 font-bold py-2 px-4 rounded"
              >
                {icon} - {name}
              </button>
            ))}
          </div>

          <input
            type="hidden"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your zodiac sign or question"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>
      )}
      {loading && (
        <div className="mt-6 text-white text-lg animate-pulse">
        🔮 Consulting the stars...
        </div>
      )}

      {response && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-mono text-purple-600 mb-4">Your prediction:</h2>
          <pre className="text-xl text-gray-700 whitespace-pre-wrap">{response.response}</pre>
        </div>
      )}
    </div>
  );
}