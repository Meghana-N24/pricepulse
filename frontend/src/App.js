import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const getTheme = (query) => {
  const q = query.toLowerCase();
  if (q.includes('dress') || q.includes('saree') || q.includes('lipstick') || q.includes('heels') || q.includes('makeup') || q.includes('women') || q.includes('girl')|| q.includes('denim skirts'))
    return { bg: '#ffe0f0', accent: '#e91e8c', emoji: '👗', label: 'girly' };
  if (q.includes('shirt') || q.includes('watch') || q.includes('shoes') || q.includes('men') || q.includes('gym') || q.includes('gaming') || q.includes('laptop') || q.includes('phone'))
    return { bg: '#1a1a2e', accent: '#00d4ff', emoji: '💪', label: 'bossy' };
  if (q.includes('sofa') || q.includes('furniture') || q.includes('chair') || q.includes('table') || q.includes('bed'))
    return { bg: '#f5e6d3', accent: '#8b5e3c', emoji: '🪑', label: 'furniture' };
  if (q.includes('fridge') || q.includes('washing') || q.includes('appliance') || q.includes('microwave') || q.includes('ac') || q.includes('fan'))
    return { bg: '#e8f5e9', accent: '#2e7d32', emoji: '🏠', label: 'home' };
  return { bg: '#f0f4ff', accent: '#3d5afe', emoji: '🛍️', label: 'default' };
};

function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState({ bg: '#f0f4ff', accent: '#3d5afe', emoji: '🛍️' });
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const t = getTheme(query);
    setTheme(t);
    try {
const res = await axios.get(`https://pricepulse-backend-cujs.onrender.com/search?query=${query}`);
      const items = res.data.data.products.slice(0, 9);
      setProducts(items);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'all 0.5s ease', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <h1 style={{ fontSize: '3rem', color: theme.accent, margin: 0 }}>
          {theme.emoji} PricePulse
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Search once. Compare everywhere. Best deal, best vibe.</p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px' }}>
        <input
          type="text"
          placeholder="Search for any product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ padding: '14px 20px', fontSize: '1rem', borderRadius: '30px', border: `2px solid ${theme.accent}`, outline: 'none', width: '400px', background: 'white' }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: '14px 28px', borderRadius: '30px', background: theme.accent, color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <p style={{ textAlign: 'center', fontSize: '1.2rem', color: theme.accent }}>⏳ Searching all platforms...</p>}

      {/* Results */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '20px 40px' }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '280px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: i < 3 ? `2px solid ${theme.accent}` : '2px solid transparent', transition: 'transform 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {i < 3 && <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{medals[i]} {i === 0 ? 'Best Pick' : i === 1 ? '2nd Best' : '3rd Best'}</div>}
            <img src={p.product_photos?.[0] || p.imagedocid} alt={p.product_title} style={{ width: '100%', height: '180px', objectFit: 'contain', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '0.9rem', margin: '10px 0 6px', color: '#333' }}>{p.product_title?.slice(0, 60)}...</h3>
            <p style={{ color: theme.accent, fontWeight: 'bold', fontSize: '1.1rem' }}>{p.offer?.price || 'Check price'}</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>⭐ {p.product_rating || 'N/A'}</p>
            <a href={p.product_page_url} target="_blank" rel="noreferrer"
              style={{ display: 'block', marginTop: '10px', padding: '8px', background: theme.accent, color: 'white', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>
              View Deal →
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