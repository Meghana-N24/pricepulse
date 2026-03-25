import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const getTheme = (query) => {
  const q = query.toLowerCase();
  if (q.includes('dress') || q.includes('saree') || q.includes('lipstick') || q.includes('heels') || q.includes('makeup') || q.includes('women') || q.includes('girl') || q.includes('skirt') || q.includes('kurti') || q.includes('lehenga') || q.includes('blouse') || q.includes('handbag') || q.includes('jewellery') || q.includes('jewelry') || q.includes('earring') || q.includes('bangle') || q.includes('purse'))
    return { bg: 'linear-gradient(135deg, #ffe0f0, #ffc2e0)', accent: '#e91e8c', emoji: '👗', caption: '💅 Slay the deal, queen!' };
  if (q.includes('shirt') || q.includes('watch') || q.includes('shoes') || q.includes('men') || q.includes('gym') || q.includes('gaming') || q.includes('laptop') || q.includes('phone') || q.includes('iphone') || q.includes('android') || q.includes('headphone') || q.includes('speaker'))
    return { bg: 'linear-gradient(135deg, #0f0f1a, #1a1a3e)', accent: '#00d4ff', emoji: '💪', caption: '⚡ Dominate the market. Best price. Best power.' };
  if (q.includes('sofa') || q.includes('furniture') || q.includes('chair') || q.includes('table') || q.includes('bed') || q.includes('wardrobe') || q.includes('shelf'))
    return { bg: 'linear-gradient(135deg, #f5e6d3, #e8d5b7)', accent: '#8b5e3c', emoji: '🪑', caption: '🏡 Find your perfect piece. Make it home.' };
  if (q.includes('fridge') || q.includes('washing') || q.includes('appliance') || q.includes('microwave') || q.includes('ac') || q.includes('fan') || q.includes('tv') || q.includes('television'))
    return { bg: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', accent: '#2e7d32', emoji: '🏠', caption: '🔌 Power up your home. Best appliances, best prices.' };
  if (q.includes('cricket') || q.includes('football') || q.includes('sport') || q.includes('fitness') || q.includes('yoga') || q.includes('cycle') || q.includes('running'))
    return { bg: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', accent: '#e65100', emoji: '🏋️', caption: '🏆 Train hard. Shop smart. Win big.' };
  if (q.includes('book') || q.includes('novel') || q.includes('stationery') || q.includes('pen') || q.includes('notebook'))
    return { bg: 'linear-gradient(135deg, #e8eaf6, #c5cae9)', accent: '#3949ab', emoji: '📚', caption: '📖 Knowledge is priceless. We just find it cheaper.' };
  return { bg: 'linear-gradient(135deg, #f0f4ff, #e8eeff)', accent: '#3d5afe', emoji: '🛍️', caption: '🔎 Search once. Compare everywhere. Best deal, best vibe.' };
};

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({ bg: 'linear-gradient(135deg, #f0f4ff, #e8eeff)', accent: '#3d5afe', emoji: '🛍️', caption: '🔎 Search once. Compare everywhere. Best deal, best vibe.' });
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    const t = getTheme(q);
    setTheme(t);
    try {
      const res = await axios.get(`https://pricepulse-backend-cujs.onrender.com/search?query=${q}`);
      const items = res.data.data.products.slice(0, 9);
      setProducts(items);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please use Chrome!');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.start();
    alert('🎤 Listening... Speak now!');
    recognition.onresult = (e) => {
      const spoken = e.results[0][0].transcript;
      setQuery(spoken);
      handleSearch(spoken);
    };
    recognition.onerror = (e) => {
      alert('Mic error: ' + e.error + '. Please allow microphone access!');
    };
  };

  const handleImageSearch = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setSearched(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const response = await axios.post(`https://pricepulse-backend-cujs.onrender.com/image-search`, {
          base64,
          mediaType: file.type
        });
        const detectedProduct = response.data.product;
        setQuery(detectedProduct);
        handleSearch(detectedProduct);
      } catch (err) {
        console.error(err);
        alert('Image search failed. Try again!');
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'all 0.5s ease', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '40px 20px 10px' }}>
        <h1 style={{ fontSize: '3rem', color: theme.accent, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          {theme.emoji} PricePulse
        </h1>
        <p style={{ color: theme.accent, fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.85 }}>{theme.caption}</p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search for any product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ padding: '14px 20px', fontSize: '1rem', borderRadius: '30px', border: `2px solid ${theme.accent}`, outline: 'none', width: '400px', background: 'white' }}
        />
        <button onClick={() => handleSearch()}
          style={{ padding: '14px 28px', borderRadius: '30px', background: theme.accent, color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>
          Search
        </button>
        <button onClick={handleVoiceSearch}
          style={{ padding: '14px 18px', borderRadius: '30px', background: theme.accent, color: 'white', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
          title="Voice Search">
          🎤
        </button>
        <label style={{ padding: '14px 18px', borderRadius: '30px', background: theme.accent, color: 'white', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }} title="Image Search">
          📸
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSearch} />
        </label>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>🔍</div>
          <p style={{ color: theme.accent, fontSize: '1.1rem', marginTop: '10px' }}>Hunting the best deals across all platforms...</p>
          <p style={{ color: '#999', fontSize: '0.85rem' }}>Comparing prices, ratings & reviews for you!</p>
        </div>
      )}

      {/* Results */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px 40px' }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '280px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: i < 3 ? `2px solid ${theme.accent}` : '2px solid #eee', transition: 'transform 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {i < 3 && <div style={{ fontSize: '1.3rem', marginBottom: '8px', color: theme.accent, fontWeight: 'bold' }}>{medals[i]} {i === 0 ? 'Best Pick' : i === 1 ? '2nd Best' : '3rd Best'}</div>}
            <img src={p.product_photos?.[0]} alt={p.product_title} style={{ width: '100%', height: '180px', objectFit: 'contain', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '0.9rem', margin: '10px 0 6px', color: '#333' }}>{p.product_title?.slice(0, 60)}...</h3>
            <p style={{ color: theme.accent, fontWeight: 'bold', fontSize: '1.1rem' }}>{p.typical_price_range?.[0] || 'Check price'}</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>⭐ {p.product_rating || 'N/A'} | 📦 {p.product_num_offers || '1'} sellers</p>
            {p.product_page_url && (
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px', wordBreak: 'break-all' }}>
                🔗 {p.product_page_url.slice(0, 40)}...
              </p>
            )}
            <a href={p.product_page_url} target="_blank" rel="noreferrer"
              style={{ display: 'block', marginTop: '10px', padding: '8px', background: theme.accent, color: 'white', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
              View Best Deal →
            </a>
          </div>
        ))}
      </div>

      {searched && !loading && products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', fontSize: '1.1rem' }}>No products found. Try a different search!</p>
      )}
    </div>
  );
}

export default App;