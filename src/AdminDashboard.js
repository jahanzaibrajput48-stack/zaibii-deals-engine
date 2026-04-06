import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [prods, setProds] = useState([]);
  const [pass, setPass] = useState("");
  const [isOk, setIsOk] = useState(false);

  useEffect(() => {
    if (!isOk) return;
    onSnapshot(collection(db, "affiliate_applications"), (s) => setApps(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, "pending_products"), (s) => setProds(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [isOk]);

  const approveAffiliate = async (app) => {
    await addDoc(collection(db, "affiliates"), { uid: app.uid, email: app.email, name: app.name });
    await deleteDoc(doc(db, "affiliate_applications", app.id));
    alert("Affiliate Approved!");
  };

  const approveProduct = async (p) => {
    await addDoc(collection(db, "products"), { ...p, approvedAt: serverTimestamp() });
    await deleteDoc(doc(db, "pending_products", p.id));
    alert("Content Live!");
  };

  if (!isOk) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <input type="password" onChange={e => setPass(e.target.value)} placeholder="Admin Password" />
      <button onClick={() => pass === "zaibii786" ? setIsOk(true) : alert("Wrong")}>Login</button>
    </div>
  );

  return (
    <div style={{ padding: '30px' }}>
      <h2>🛡️ Admin Control</h2>
      
      <h3>👥 Affiliate Applications</h3>
      {apps.map(a => (
        <div key={a.id} style={{ background: '#fff', padding: '15px', marginBottom: '10px' }}>
          {a.name} ({a.platform}) - <button onClick={() => approveAffiliate(a)}>Approve Worker</button>
        </div>
      ))}

      <hr />

      <h3>📦 Pending Content</h3>
      {prods.map(p => (
        <div key={p.id} style={{ background: '#fff', padding: '15px', marginBottom: '10px' }}>
          {p.title} [{p.category}] by {p.userName} - <button onClick={() => approveProduct(p)}>Make Live</button>
        </div>
      ))}
    </div>
  );
}