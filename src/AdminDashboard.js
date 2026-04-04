import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";

export default function AdminDashboard() {
  const [clicks, setClicks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pLink, setPLink] = useState("");
  const [pStore, setPStore] = useState("Daraz");

  const MY_SECRET_PASSWORD = "zaibii_admin_786"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === MY_SECRET_PASSWORD) setIsLoggedIn(true);
    else alert("Ghalat Password! Dobara koshish karein.");
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        name: pName,
        price: Number(pPrice),
        link: pLink,
        store: pStore,
        createdAt: serverTimestamp()
      });
      alert("Product Add Ho Gaya! ✅");
      setPName(""); setPPrice(""); setPLink("");
    } catch (err) { alert("Error: " + err.message); }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const q = query(collection(db, "clicks"), orderBy("time", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setClicks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f1f3f4" }}>
        <form onSubmit={handleLogin} style={{ background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ color: "#4285F4" }}>Zaibii Admin Login</h2>
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "20px" }} />
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#4285F4", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Zaibii Control Center ⚙️</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ background: "#ea4335", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
      </div>

      <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginTop: 0 }}>➕ Add New Product Deal</h3>
        <form onSubmit={addProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
          <input type="text" placeholder="Product Name" value={pName} onChange={(e) => setPName(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
          <input type="number" placeholder="Price (PKR)" value={pPrice} onChange={(e) => setPPrice(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }} />
          <select value={pStore} onChange={(e) => setPStore(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}>
            <option value="Daraz">Daraz</option>
            <option value="AliExpress">AliExpress</option>
            <option value="Amazon">Amazon</option>
          </select>
          <input type="text" placeholder="Affiliate Link" value={pLink} onChange={(e) => setPLink(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", gridColumn: "span 2" }} />
          <button type="submit" style={{ background: "#34A853", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>Save Product</button>
        </form>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ padding: "20px", background: "#4285F4", color: "#fff", borderRadius: "10px", flex: 1 }}>
          <h3 style={{ margin: 0, opacity: 0.8 }}>Total Clicks</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0 0" }}>{clicks.length}</p>
        </div>
        <div style={{ padding: "20px", background: "#34A853", color: "#fff", borderRadius: "10px", flex: 1 }}>
          <h3 style={{ margin: 0, opacity: 0.8 }}>Est. Earning</h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0 0" }}>Rs. {clicks.length * 50}</p>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <h4>Recent Activity Log</h4>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "12px" }}>Product</th>
              <th style={{ padding: "12px" }}>Store</th>
              <th style={{ padding: "12px" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map(click => (
              <tr key={click.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{click.product}</td>
                <td style={{ padding: "12px" }}>{click.store}</td>
                <td style={{ padding: "12px" }}>Rs. {click.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}