import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function AffiliateDashboard({ user }) {
  const [isAffiliate, setIsAffiliate] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [form, setForm] = useState({ name: "", fName: "", phone: "", platform: "", platformLink: "" });

  useEffect(() => {
    if (!user) return;
    // Check if user is approved affiliate
    const q = query(collection(db, "affiliates"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => setIsAffiliate(!snap.empty));

    // Get my clicks/analytics
    const qC = query(collection(db, "clicks"), where("affiliateId", "==", user.uid));
    onSnapshot(qC, (snap) => setClicks(snap.docs.length));

    // Get my items
    const qI = query(collection(db, "products"), where("userId", "==", user.uid));
    onSnapshot(qI, (snap) => setMyItems(snap.docs.map(d => d.data())));

    return () => unsub();
  }, [user]);

  const applyNow = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "affiliate_applications"), { ...form, uid: user.uid, email: user.email, status: "pending" });
    alert("Application submitted! Admin will review it.");
  };

  const uploadItem = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    await addDoc(collection(db, "pending_products"), {
      title: data.get("title"),
      price: data.get("price") || "Free",
      link: data.get("link"),
      mediaUrl: data.get("mediaUrl"),
      category: data.get("category"), // product, app, movie, series
      userId: user.uid,
      userName: user.displayName,
      createdAt: serverTimestamp()
    });
    alert("Sent for approval!");
    e.target.reset();
  };

  if (!user) return <h2 style={{ textAlign: 'center' }}>Please Login First</h2>;

  if (isAffiliate === false) {
    return (
      <div style={{ maxWidth: '500px', margin: '50px auto', background: '#fff', padding: '30px', borderRadius: '15px' }}>
        <h2>📝 Join Affiliate Program</h2>
        <form onSubmit={applyNow}>
          <input placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} style={inpStyle} required />
          <input placeholder="Father Name" onChange={e => setForm({...form, fName: e.target.value})} style={inpStyle} required />
          <input placeholder="WhatsApp Number" onChange={e => setForm({...form, phone: e.target.value})} style={inpStyle} required />
          <select onChange={e => setForm({...form, platform: e.target.value})} style={inpStyle} required>
            <option value="">Select Your Platform</option>
            <option value="YouTube">YouTube</option>
            <option value="Facebook/WhatsApp">Facebook/WhatsApp</option>
            <option value="Website">Website</option>
          </select>
          <input placeholder="Platform Link" onChange={e => setForm({...form, platformLink: e.target.value})} style={inpStyle} required />
          <button type="submit" style={btnStyle}>Submit Application</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>🚀 Affiliate Dashboard</h1>
      
      {/* Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={statCard}><h3>Total Clicks</h3><p style={{fontSize: '2rem'}}>{clicks}</p></div>
        <div style={statCard}><h3>Live Items</h3><p style={{fontSize: '2rem'}}>{myItems.length}</p></div>
      </div>

      {/* Upload Form */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 2px 10px #eee' }}>
        <h3>➕ Upload Content</h3>
        <form onSubmit={uploadItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input name="title" placeholder="Title (e.g. iPhone 15 or Avengers)" style={inpStyle} required />
          <input name="price" placeholder="Price/Quality (e.g. Rs. 500 or 1080p)" style={inpStyle} />
          <input name="link" placeholder="Affiliate/Download Link" style={inpStyle} required />
          <input name="mediaUrl" placeholder="Image/Poster URL" style={inpStyle} required />
          <select name="category" style={inpStyle} required>
            <option value="product">Trending Product</option>
            <option value="app">Trending App</option>
            <option value="movie">Movie</option>
            <option value="series">Web Series</option>
          </select>
          <button type="submit" style={btnStyle}>Upload for Approval</button>
        </form>
      </div>
    </div>
  );
}

const inpStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { padding: '12px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const statCard = { background: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 10px #eee' };