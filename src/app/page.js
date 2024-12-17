'use client';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import { FaSave, FaShareAlt } from 'react-icons/fa'; // Importando ícones do FontAwesome

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

  const share = async () => {
    const element = document.getElementById('prediction-card'); // The element to capture
    if (!element) return;

    try {
      // Capture the element as an image
      const canvas = await html2canvas(element, { scale: 3 }); // Ajuste de escala para maior qualidade
      const image = canvas.toDataURL('image/png'); // Convert canvas to base64 image

      // Check if the browser supports the Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Minha previsão',
          text: 'Confira minha previsão do dia!',
          files: [new File([image], 'previsao.png', { type: 'image/png' })],
        });
      } else {
        // Fallback: Download the image
        const link = document.createElement('a');
        link.href = image;
        link.download = 'previsao.png';
        link.click();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const saveImage = async () => {
    const element = document.getElementById('prediction-card');
    if (!element) return;
  
    try {
      // Captura o elemento como um canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Aumenta a escala para maior qualidade
        useCORS: true, // Permite capturar imagens externas
        backgroundColor: null, // Garante que o fundo seja transparente, se necessário
      });
  
      // Converte o canvas para uma imagem
      const image = canvas.toDataURL('image/png');
  
      // Trigger download
      const link = document.createElement('a');
      link.href = image;
      link.download = 'previsao.png';
      link.click();
    } catch (error) {
      console.error('Error saving image:', error);
    }
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

        {!loading && !response && (
          <div className="relative w-96 h-96">
            {signs.map(({ id, name, icon }, index) => {
              const radius = 42; // Define a mesma distância para ambos os eixos
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
          <div
            id="prediction-card"
            className="mt-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6 shadow-2xl max-w-md w-full border-2 border-blue-300"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🔮</span> {/* Ícone decorativo */}
              <h2 className="text-2xl font-bold text-blue-600 ml-2">Sua Previsão</h2>
            </div>
            <pre className="text-center text-lg text-gray-800 font-serif whitespace-pre-wrap leading-relaxed">
              {response.response}
            </pre>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 italic">&ldquo;Confie nos astros e aproveite o dia!&rdquo;</span>
            </div>
          </div>
        )}
        <br></br>
        {response && (
          <div className="flex flex-col gap-2">

            <button
              type="button"
              onClick={share}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaShareAlt /> Compartilhar
            </button>
            <button
              type="button"
              onClick={saveImage}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaSave /> Salvar Imagem
            </button>

            <button
              type="reset"
              onClick={() => resetForm()}
              className="bg-white hover:bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </form>
  );
}