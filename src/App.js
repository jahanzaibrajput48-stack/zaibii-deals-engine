import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import AdminDashboard from "./AdminDashboard";

function MainSite({ searchTerm, setSearchTerm }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Search Header */}
      <div style={{ backgroundColor: "#ffffff", padding: "30px 20px", textAlign: "center", borderBottom: "1px solid #eee" }}>
        <h1 style={{ margin: "0", color: "#1a73e8", fontWeight: '800' }}>Zaibii Deals</h1>
        <input 
          type="text" 
          placeholder="Search gadgets, bags, electronics..." 
          style={{ width: "100%", maxWidth: "500px", padding: "12px 20px", borderRadius: "25px", border: "1px solid #ddd", marginTop: "15px", outline: 'none' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {products
            .filter(p => (p.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
            .map(product => (
              <div key={product.id} style={{ background: "#fff", borderRadius: "10px", padding: "15px", border: "1px solid #efefef", transition: '0.3s', display: 'flex', flexDirection: 'column' }}>
                
                <img src={product.mediaUrl} alt="product" style={{ width: "100%", height: "180px", objectFit: "contain", marginBottom: "10px" }} />
                
                <h3 style={{ fontSize: "0.95rem", color: "#333", height: "40px", overflow: "hidden", marginBottom: "10px" }}>{product.title}</h3>
                
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: '#34A853', fontWeight: 'bold', fontSize: '1.1rem' }}>{product.price}</span>
                        <span style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{product.category}</span>
                    </div>
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ background: "#1a73e8", color: "#fff", padding: "10px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", display: 'block', textAlign: 'center', fontSize: '14px' }}
                    >
                      View on Store →
                    </a>
                </div>
              </div>
            ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '20px' }}>
        <Link to="/admin" style={{ color: '#ccc', textDecoration: 'none', fontSize: '12px' }}>Admin Login</Link>
      </footer>
    </div>
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}