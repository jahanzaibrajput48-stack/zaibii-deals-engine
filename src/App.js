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

  const trackClick = async (productName, price) => {
    try {
      await addDoc(collection(db, "clicks"), {
        product: productName || "Unknown",
        price: price || 0,
        time: serverTimestamp()
      });
    } catch (e) { console.error("Tracking Error: ", e); }
  };

  return (
    <div style={{ backgroundColor: "#f1f3f4", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#fff", padding: "40px 20px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ margin: "0", color: "#4285F4", fontSize: "2.5rem" }}>Zaibii Global Search</h1>
        <input 
          type="text" 
          placeholder="Search products..." 
          style={{ width: "100%", maxWidth: "600px", padding: "15px 25px", borderRadius: "30px", border: "1px solid #dfe1e5", marginTop: "20px", fontSize: "16px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
          {products
            // 🛡️ FIX: 'name' ki jagah 'title' use kiya aur ?. lagaya taake crash na ho
            .filter(p => (p.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()))
            .map(product => (
              <div key={product.id} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #eee", overflow: "hidden" }}>
                {/* 🖼️ Image Display */}
                {product.mediaUrl && (
                  <img src={product.mediaUrl} alt={product.title} style={{ width: "100%", height: "200px", objectFit: "contain", marginBottom: "15px" }} />
                )}
                
                <h3 style={{ color: "#202124", marginBottom: "15px", fontSize: "1.1rem" }}>{product.title}</h3>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#5f6368", display: "block" }}>{product.category || "Deals"}</span>
                    <span style={{ fontWeight: "bold", color: "#34A853", fontSize: "1.1rem" }}>Rs. {product.price}</span>
                  </div>
                  <a 
                    href={product.link} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => trackClick(product.title, product.price)}
                    style={{ background: "#4285F4", color: "#fff", padding: "8px 15px", borderRadius: "5px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}
                  >
                    View Deal →
                  </a>
                </div>
              </div>
            ))}
        </div>
        {products.length === 0 && <p style={{ textAlign: "center", color: "#999", marginTop: "50px" }}>No active deals found. Add some from Admin Panel!</p>}
      </div>

      <footer style={{ textAlign: 'center', padding: '40px' }}>
        <Link to="/admin" style={{ color: '#dadce0', textDecoration: 'none', fontSize: '11px' }}>Admin Panel</Link>
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