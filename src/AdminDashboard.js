import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", price: "", link: "", mediaUrl: "", category: "Trending" });
  const [showUpload, setShowUpload] = useState(false);

  // 1. Fetch Products & Clicks Activity
  useEffect(() => {
    const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribeProducts = onSnapshot(qProducts, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qClicks = query(collection(db, "clicks"), orderBy("time", "desc"));
    const unsubscribeClicks = onSnapshot(qClicks, (snap) => {
      setClicks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubscribeProducts(); unsubscribeClicks(); };
  }, []);

  // 2. Handle Manual Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.link) return alert("Please fill Title and Link!");
    
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        createdAt: serverTimestamp()
      });
      alert("✅ Product Added Successfully!");
      setNewProduct({ title: "", price: "", link: "", mediaUrl: "", category: "Trending" });
      setShowUpload(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f7f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* --- TOP HEADER & UPLOAD BAR --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: "#202124" }}>Admin Control Center</h1>
        <button 
          onClick={() => setShowUpload(!showUpload)}
          style={{ padding: '12px 25px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showUpload ? "× Close Panel" : "+ Add New Product"}
        </button>
      </div>

      {/* --- QUICK UPLOAD FORM (The Bar you asked for) --- */}
      {showUpload && (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h3>🚀 Quick Upload Product</h3>
          <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Product Title" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="Price (e.g. Rs. 1,200)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="Image URL" value={newProduct.mediaUrl} onChange={e => setNewProduct({...newProduct, mediaUrl: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="Product Link (Affiliate)" value={newProduct.link} onChange={e => setNewProduct({...newProduct, link: e.target.value})} style={inputStyle} />
            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={inputStyle}>
                <option value="Trending">Trending</option>
                <option value="AliExpress">AliExpress</option>
                <option value="Daraz">Daraz</option>
            </select>
            <button type="submit" style={{ gridColumn: 'span 2', padding: '12px', backgroundColor: '#34a853', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Publish to Site</button>
          </form>
        </div>
      )}

      {/* --- ACTIVITY STATS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={statCard}><h3>📦 Total Products</h3><p style={{fontSize: '2rem', margin: '0'}}>{products.length}</p></div>
        <div style={statCard}><h3>🖱️ Total Clicks</h3><p style={{fontSize: '2rem', margin: '0', color: '#1a73e8'}}>{clicks.length}</p></div>
        <div style={statCard}><h3>🔥 Recent Activity</h3><p style={{fontSize: '1rem', color: '#555'}}>{clicks[0]?.product || "No clicks yet"}</p></div>
      </div>

      {/* --- RECENT CLICK LOGS (Personal Activity Data) --- */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd' }}>
        <h3>📜 Real-time Click Activity</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px' }}>Product</th>
              <th>Price</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map(click => (
              <tr key={click.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{click.product}</td>
                <td>{click.price}</td>
                <td style={{ color: '#888', fontSize: '12px' }}>{click.time?.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' };
const statCard = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };