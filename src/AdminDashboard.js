import React, { useState } from 'react';
import { db } from './firebase'; // Aapki firebase.js file se db import ho raha hai
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

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

  // --- 1. Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "03183102571z1") {
      setIsLoggedIn(true);
    } else {
      alert("Ghalat Password! Dobara koshish karein.");
    }
  };

  // --- 2. Auto-Fill Logic (Using your API Key) ---
  const handleAutoFill = async (url) => {
    if (!url || !url.startsWith('http')) return;
    setLoading(true);
    try {
      const apiKey = "f896154306570074434e939956ce49a2"; 
      const res = await fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${url}`);
      const data = await res.json();
      
      if (data && data.title) {
        setProduct(prev => ({
          ...prev,
          title: data.title || prev.title,
          mediaUrl: data.image || prev.mediaUrl,
        }));
      }
    } catch (error) {
      console.log("Auto-fill error.");
    }
    setLoading(false);
  };

  // --- 3. Firebase Save Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.title || !product.mediaUrl) {
      alert("Title aur Image URL lazmi hain!");
      return;
    }

    setLoading(true);
    try {
      // "products" naam ki collection mein data save ho raha hai
      await addDoc(collection(db, "products"), {
        ...product,
        createdAt: serverTimestamp(), 
      });

      alert("✅ Product Firebase mein save ho gaya!");
      
      // Form Reset
      setProduct({ title: '', price: '', category: 'Deals', link: '', mediaUrl: '', mediaType: 'image' });
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
    setLoading(false);
  };

  // --- UI: Login Screen ---
  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2>🔐 Zaibii Admin</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Password" 
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- UI: Dashboard Screen ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Dashboard</h3>
        <button onClick={() => setIsLoggedIn(false)} style={{padding: '5px 10px', cursor: 'pointer'}}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>Product Link (Optional):</label>
        <input 
          type="text" 
          placeholder="Paste link & click outside" 
          value={product.link}
          onChange={(e) => setProduct({...product, link: e.target.value})}
          onBlur={(e) => handleAutoFill(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Product Title:</label>
        <input 
          type="text" 
          value={product.title}
          onChange={(e) => setProduct({...product, title: e.target.value})}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Price (RS):</label>
        <input 
          type="number" 
          value={product.price}
          onChange={(e) => setProduct({...product, price: e.target.value})}
          style={inputStyle}
        />

        <label style={labelStyle}>Media URL (Image/Video):</label>
        <input 
          type="text" 
          value={product.mediaUrl}
          onChange={(e) => setProduct({...product, mediaUrl: e.target.value})}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Type:</label>
        <select 
          value={product.mediaType} 
          onChange={(e) => setProduct({...product, mediaType: e.target.value})}
          style={{marginBottom: '15px', padding: '10px'}}
        >
          <option value="image">Image 🖼️</option>
          <option value="video">Video 🎥</option>
        </select>

        {product.mediaUrl && (
          <div style={{textAlign: 'center', margin: '10px 0'}}>
            <img src={product.mediaUrl} alt="Preview" style={{width: '100px', borderRadius: '5px'}} />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          style={{ ...btnStyle, background: '#28a745' }}
        >
          {loading ? "Uploading..." : "🚀 Save to Firebase"}
        </button>
      </form>
    </div>
  );
};

// --- Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' };
const cardStyle = { background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const formStyle = { background: '#fff', padding: '25px', borderRadius: '15px', border: '1px solid #eee' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' };

export default AdminDashboard;