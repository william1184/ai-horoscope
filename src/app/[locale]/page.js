'use client';
import html2canvas from 'html2canvas';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSave, FaShareAlt } from 'react-icons/fa'; // Importando ícones do FontAwesome

export default function Home() {
  const locale = useLocale();
  const t = useTranslations('HomePage');

  const [sign, setSign] = useState('');
  const [response, setResponse] = useState(null);
  const [signsLoading, setSignsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signs, setSigns] = useState([]);
  
  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setSignsLoading(true);
        const res = await fetch('/api/signs?locale=' + locale, {
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

      const res = await fetch(`/api/signs/${sign}/prediction?locale=${locale}`, {
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

  const shareImage = async () => {
    try {
      const image = await createCanvasFromPrediction();
  
      if (navigator.share) {
        // API de compartilhamento nativa
        await navigator.share({
          title: t('shareImageTitle'),
          text: t('shareImageText'),
          files: [
            new File([await (await fetch(image)).blob()], t('fileNamePrediction'), {
              type: 'image/png',
            }),
          ],
        });
      } else {
        alert(t('shareNotSupportedAlert'));
      }
    } catch (error) {
      console.error('Erro ao compartilhar a imagem:', error);
    }
  };

  const saveImage = async () => {
    try {
      const image = await createCanvasFromPrediction();

      // Trigger download
      const link = document.createElement('a');
      link.href = image;
      link.download = t('fileNamePrediction');
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
      <div className="flex flex-col items-center justify-center p-4 relative overflow-hidden">

        <h1 className="text-2xl font-mono font-extrabold text-white mb-6 text-center leading-relaxed animate-fade-in" >
          {t('titlePrompt')}
          <br />
          <span
            className="text-lg font-medium"
          >
            {t.rich('instructions', {
              // eslint-disable-next-line react/display-name
              br: () => <br />
            })}
          </span>
        </h1>

        {!loading && !response && (
          <div>
            {signsLoading ? (
              <div className="text-white">{t('loadingSigns')}</div>
            ) : (
              <div className="relative w-96 h-96">
                {signs.map(({ id, name, icon }, index) => { // Adicionado translationKey
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
                      title={name} // Usar a chave para tradução
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
            {t('consultingStars')}
          </div>
        )}

        {response && (
          <div
            id="prediction-card"
            className="mt-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6 shadow-2xl max-w-md w-full border-2 border-blue-300"
          >
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">🔮</span> {/* Ícone decorativo */}
              <h2 className="text-2xl font-bold text-blue-600 ml-2">{t('predictionCardTitle')}</h2>
            </div>
            <pre className="text-center text-lg text-gray-800 font-serif whitespace-pre-wrap leading-relaxed">
              {response.response}
            </pre>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 italic">{t('predictionCardQuote')}</span>
            </div>
            {/* Adicionando o rodapé com o nome do site */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-blue-500 hover:text-blue-700 font-bold text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('poweredBy')}
              </Link>
            </div>
          </div>
        )}
        <br></br>
        {response && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={shareImage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaShareAlt /> {t('shareButton')}
            </button>

            <button
              type="button"
              onClick={saveImage}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <FaSave /> {t('saveButton')}
            </button>

            <button
              type="reset"
              onClick={() => resetForm()}
              className="bg-white hover:bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded"
            >
              {t('backButton')}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}