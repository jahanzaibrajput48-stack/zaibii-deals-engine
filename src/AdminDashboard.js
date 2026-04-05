import React, { useState } from 'react';

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    title: '',
    price: '',
    category: 'Deals',
    link: '', 
    mediaUrl: '',
    mediaType: 'image',
  });

  // --- Login Function ---
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = "03183102571z1"; // Aapka password
    if (password === correctPassword) {
      setIsLoggedIn(true);
    } else {
      alert("Ghalat Password! Dobara koshish karein.");
    }
  };

  // --- Auto-Fill Function (Using Your API Key) ---
  const handleAutoFill = async (url) => {
    if (!url || !url.startsWith('http')) return;
    
    setLoading(true);
    try {
      const apiKey = "f896154306570074434e939956ce49a2"; // Aapki LinkPreview Key
      const res = await fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${url}`);
      const data = await res.json();
      
      if (data && data.title) {
        setProduct(prev => ({
          ...prev,
          title: data.title || prev.title,
          mediaUrl: data.image || prev.mediaUrl,
          mediaType: 'image'
        }));
      }
    } catch (error) {
      console.log("Auto-fill error: API limit ya network ka masla ho sakta hai.");
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.title || !product.mediaUrl) {
      alert("Title aur Image URL lazmi hain!");
      return;
    }
    
    // Yahan aapka database save karne ka logic aayega
    console.log("Saving Product:", product);
    alert("Product Uploaded Successfully!");
    
    // Form Reset
    setProduct({ title: '', price: '', category: 'Deals', link: '', mediaUrl: '', mediaType: 'image' });
  };

  // --- Login UI ---
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4', fontFamily: 'Arial' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{color: '#333'}}>🔒 Admin Panel</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', width: '250px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', display: 'block' }}
            />
            <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard UI ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2 style={{margin: 0}}>Zaibii Dashboard</h2>
        <button onClick={() => setIsLoggedIn(false)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        {/* Product Link Box */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Product Link (Optional):</label>
          <input 
            type="text" 
            placeholder="Paste link and click outside to auto-fill" 
            value={product.link}
            onChange={(e) => setProduct({...product, link: e.target.value})}
            onBlur={(e) => handleAutoFill(e.target.value)} // Fixed: Name matched with function
            style={inputStyle}
          />
          {loading && <p style={{fontSize: '12px', color: 'blue'}}>🔍 Fetching data from link...</p>}
        </div>

        {/* Title Box */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Product Title:</label>
          <input 
            type="text" 
            value={product.title}
            onChange={(e) => setProduct({...product, title: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        {/* Price Box */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Price (RS):</label>
          <input 
            type="number" 
            value={product.price}
            onChange={(e) => setProduct({...product, price: e.target.value})}
            style={inputStyle}
          />
        </div>

        {/* Image/Video URL Box */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Image or Video URL:</label>
          <input 
            type="text" 
            placeholder="Direct link to image or video"
            value={product.mediaUrl}
            onChange={(e) => setProduct({...product, mediaUrl: e.target.value})}
            style={inputStyle}
            required
          />
        </div>

        {/* Media Type Toggle */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Content Type:</label>
          <select 
            value={product.mediaType} 
            onChange={(e) => setProduct({...product, mediaType: e.target.value})}
            style={{ marginLeft: '10px', padding: '8px', borderRadius: '5px' }}
          >
            <option value="image">Image 🖼️</option>
            <option value="video">Video 🎥</option>
          </select>
        </div>

        {/* Preview */}
        {product.mediaUrl && (
          <div style={{ margin: '15px 0', padding: '10px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{fontSize: '11px', color: '#888'}}>Preview:</p>
            {product.mediaType === 'image' ? (
              <img src={product.mediaUrl} alt="Preview" style={{ maxWidth: '100%', height: '100px', borderRadius: '5px' }} />
            ) : (
              <video src={product.mediaUrl} width="150" controls />
            )}
          </div>
        )}

        <button type="submit" style={saveBtnStyle}>🚀 Save Product</button>
      </form>
    </div>
  );
};

// Simple Styles
const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ddd' };
const saveBtnStyle = { background: '#28a745', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '16px', fontWeight: 'bold' };

export default AdminDashboard;
