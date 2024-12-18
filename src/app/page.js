'use client';
import html2canvas from 'html2canvas';
import { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa'; // Importando ícones do FontAwesome

export default function Home() {
  const [sign, setSign] = useState('');
  const [response, setResponse] = useState(null);
  const [signsLoading, setSignsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signs, setSigns] = useState([]);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const starCount = 25;
    const generatedStars = Array.from({ length: starCount }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setSignsLoading(true);
        const res = await fetch('/api/signs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const response = await res.json();
        setSigns(response.data.signs);
      } catch (error) {
        console.error('Error fetching signs:', error);
      } finally {
        setSignsLoading(false);
      }
    };

    fetchSigns();
  }, []);

  const handleSignClick = (id) => {
    setSign(`${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const predict_by_sign = getDailyPredictionSaved()
      if (predict_by_sign && predict_by_sign[sign]) {
        setResponse(predict_by_sign[sign]);

        return;
      }

      const res = await fetch(`/api/signs/${sign}/prediction`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setResponse(data);

      // Salva a previsão e a data no localStorage
      predict_by_sign[sign] = data
      persistPrediction(predict_by_sign)
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const get_now_in_str = () => {
    const datenow = new Date();
    return `${datenow.getFullYear()}-${datenow.getMonth() + 1}-${datenow.getDate()}`
  }

  const getDailyPredictionSaved = () => {
    const savedPrediction = localStorage.getItem('dailyPrediction');
    const savedDate = localStorage.getItem('predictionDate');

    if (savedPrediction && savedDate === get_now_in_str()) {
      return JSON.parse(savedPrediction);
    }

    return {}
  }

  const persistPrediction = (predict_by_sign) => {
    localStorage.setItem('dailyPrediction', JSON.stringify(predict_by_sign));
    localStorage.setItem('predictionDate', get_now_in_str());
  }

  const resetForm = () => {
    setSign('');
    setResponse(null);
  };

  const createCanvasFromPrediction = async () => {
    const element = document.getElementById('prediction-card');
    if (!element) return;

    // Captura o elemento como um canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a escala para maior qualidade
      useCORS: true, // Permite capturar imagens externas
      backgroundColor: null, // Garante que o fundo seja transparente, se necessário
    });

    // Converte o canvas para uma imagem
    return canvas.toDataURL('image/png');
  };

  const saveImage = async () => {
    try {
      const image = await createCanvasFromPrediction();

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
        <div className="absolute inset-0 stars">
          {stars.map((star, index) => (
            <div
              key={index}
              className="star"
              style={{ top: star.top, left: star.left }}
            ></div>
          ))}
        </div>

        <h1 className="text-2xl font-mono font-extrabold text-white mb-6 text-center leading-relaxed animate-fade-in">
          Quer dar uma espiadinha no futuro?
          <br />
          <span className="text-lg font-medium">
            Descubra o que o aguarda hoje. <br></br> Selecione seu signo e embarque nessa jornada astral!
          </span>
        </h1>

        {!loading && !response && (
          <div>
            {signsLoading ? (
              <div className="text-white">Loading signs...</div>
            ) : (
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
          </div>
        )}

        {loading && (
          <div className="mt-6 text-white text-lg animate-pulse" aria-live="polite">
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
            {/* Adicionando o rodapé com o nome do site */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-blue-500 hover:text-blue-700 font-bold text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Powered by Horoscope AI
              </a>
            </div>
          </div>
        )}
        <br></br>
        {response && (
          <div className="flex flex-col gap-2">
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