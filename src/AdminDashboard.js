import React, { useState } from 'react';

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [product, setProduct] = useState({
    title: '',
    price: '',
    category: 'Deals',
    link: '', 
    mediaUrl: '',
    mediaType: 'image',
  });

  const [loading, setLoading] = useState(false);

  // --- Login Function ---
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = "03183102571z1"; // Aapka bataya hua password
    if (password === correctPassword) {
      setIsLoggedIn(true);
    } else {
      alert("Ghalat Password! Dobara koshish karein.");
    }
  };

  // --- Auto-Fetch Logic (Link se data nikalne ke liye) ---
  const handleLinkBlur = async (url) => {
    if (!url || !url.startsWith('http')) return;
    setLoading(true);
    try {
      // LinkPreview API (Free Version)
      const res = await fetch(`https://api.linkpreview.net/?key=5b578c75e7a9e334a17950c4819545d6&q=${url}`);
      const data = await res.json();
      if (data && !data.error) {
        setProduct({
          ...product,
          title: data.title || product.title,
          mediaUrl: data.image || product.mediaUrl,
          mediaType: data.image ? 'image' : 'video'
        });
      }
    } catch (error) {
      console.log("Auto-fetch error.");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.title || !product.mediaUrl) {
      alert("Kam az kam Title aur Image URL hona zaroori hai!");
      return;
    }
    
    // Yahan aapka product save karne ka logic aayega (Firebase/API)
    console.log("Product Data:", product);
    alert("Product Successfully Save Ho Gaya!");
    
    // Form Reset
    setProduct({ title: '', price: '', category: 'Deals', link: '', mediaUrl: '', mediaType: 'image' });
  };

  // --- 1. Login Screen (Sirf Password) ---
  if (!isLoggedIn) {
    return (
      <div style={loginContainerStyle}>
        <div style={loginBoxStyle}>
          <h2 style={{color: '#333'}}>🔒 Admin Access</h2>
          <p style={{fontSize: '13px', color: '#666'}}>Dashboard kholne ke liye password dalein</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoFocus
            />
            <button type="submit" style={loginBtnStyle}>Open Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // --- 2. Main Dashboard (After Login) ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2 style={{margin: 0, color: '#222'}}>Zaibii Dashboard</h2>
        <button onClick={() => setIsLoggedIn(false)} style={logoutBtnStyle}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Step 1: Link Paste Karein (Optional) */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Product Link (Auto-Fill ke liye):</label>
          <input 
            type="text" 
            placeholder="Paste product link here..." 
            value={product.link}
            onChange={(e) => setProduct({...product, link: e.target.value})}
            onBlur={(e) => handleLinkBlur(e.target.value)}
            style={inputStyle}
          />
          {loading && <p style={{fontSize: '12px', color: '#007bff'}}>🔍 Data fetch ho raha hai...</p>}
        </div>

        {/* Step 2: Title */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Product Title:</label>
          <input 
            type="text" 
            value={product.title}
            onChange={(e) => setProduct({...product, title: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        {/* Step 3: Price */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Price (RS):</label>
          <input 
            type="number" 
            value={product.price}
            onChange={(e) => setProduct({...product, price: e.target.value})}
            style={inputStyle}
          />
        </div>

        {/* Step 4: Media URL */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Image or Video URL:</label>
          <input 
            type="text" 
            placeholder="https://example.com/image.jpg"
            value={product.mediaUrl}
            onChange={(e) => setProduct({...product, mediaUrl: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        {/* Step 5: Type Selection */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Media Type:</label>
          <select 
            value={product.mediaType} 
            onChange={(e) => setProduct({...product, mediaType: e.target.value})}
            style={{...inputStyle, width: '100px', cursor: 'pointer'}}
          >
            <option value="image">Image 🖼️</option>
            <option value="video">Video 🎥</option>
          </select>
        </div>

        {/* Preview Section */}
        {product.mediaUrl && (
          <div style={previewBoxStyle}>
            <p style={{fontSize: '11px', margin: '0 0 5px 0'}}>Preview:</p>
            {product.mediaType === 'image' ? (
              <img src={product.mediaUrl} alt="Preview" style={{ maxWidth: '100%', height: '80px', borderRadius: '5px' }} />
            ) : (
              <video src={product.mediaUrl} width="120" height="80" controls />
            )}
          </div>
        )}

        <button type="submit" style={saveBtnStyle}>🚀 Upload Product</button>
      </form>
    </div>
  );
};

// --- CSS Styles (JS Objects) ---
const loginContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' };
const loginBoxStyle = { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' };
const formStyle = { background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const fieldStyle = { marginBottom: '18px', textAlign: 'left' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' };
const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' };
const loginBtnStyle = { background: '#007bff', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px' };
const saveBtnStyle = { background: '#28a745', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' };
const logoutBtnStyle = { background: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' };
const previewBoxStyle = { background: '#f9f9f9', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', border: '1px dashed #ccc' };

export default AdminDashboard;
