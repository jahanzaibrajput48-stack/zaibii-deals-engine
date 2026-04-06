import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, where } from "firebase/firestore";
import AdminDashboard from "./AdminDashboard";
import AffiliateDashboard from "./AffiliateDashboard";

// --- LOGIN / SIGNUP PAGE ---
function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.location.href = "/";
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleAuth} style={cardStyle}>
        <h3>{isSignup ? "Create Zaibii Account" : "Login to Continue"}</h3>
        {isSignup && <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} style={inpStyle} required />}
        <input type="email" placeholder="Email (Gmail)" onChange={e => setEmail(e.target.value)} style={inpStyle} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={inpStyle} required />
        <button type="submit" style={btnStyle}>{isSignup ? "Sign Up" : "Login"}</button>
        <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: 'pointer', color: '#1a73e8', marginTop: '10px' }}>
          {isSignup ? "Already have an account? Login" : "New user? Create account"}
        </p>
      </form>
    </div>
  );
}

// --- HOME PAGE WITH CATEGORIES ---
function Home() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const renderSection = (title, category) => {
    const filtered = items.filter(i => i.category === category);
    if (filtered.length === 0) return null;
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ borderBottom: '2px solid #1a73e8', display: 'inline-block' }}>{title}</h2>
        <div style={scrollContainer}>
          {filtered.map(item => (
            <div key={item.id} style={itemCard}>
              <img src={item.mediaUrl} style={imgStyle} alt="" />
              <h4>{item.title}</h4>
              <p style={{ color: 'green', fontWeight: 'bold' }}>{item.price}</p>
              <button onClick={() => trackClick(item)} style={btnStyle}>Get Deal</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const trackClick = async (item) => {
    await addDoc(collection(db, "clicks"), {
      productId: item.id,
      affiliateId: item.userId,
      time: serverTimestamp()
    });
    window.open(item.link, "_blank");
  };

  return (
    <div>
      {renderSection("🔥 Trending Products", "product")}
      {renderSection("📱 Trending Apps", "app")}
      {renderSection("🎬 Movies", "movie")}
      {renderSection("📺 Movie Series", "series")}
    </div>
  );
}

// --- MAIN WRAPPER ---
export default function App() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/" style={{ textDecoration: 'none', color: '#1a73e8', fontSize: '24px', fontWeight: 'bold' }}>Zaibii Engine</Link>
        <div style={{ position: 'relative' }}>
          {user ? (
            <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={profileIcon}>
              👤 {user.displayName || "Account"}
            </div>
          ) : (
            <Link to="/auth" style={navBtn}>Login</Link>
          )}
          
          {showProfileMenu && (
            <div style={dropdownStyle}>
              <Link to="/affiliate" style={dropItem} onClick={() => setShowProfileMenu(false)}>🚀 Affiliate Center</Link>
              <div style={dropItem} onClick={() => signOut(auth)}>Logout</div>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/affiliate/*" element={<AffiliateDashboard user={user} />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

// Styles
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 50px', background: '#fff', boxShadow: '0 2px 5px #eee', alignItems: 'center' };
const profileIcon = { cursor: 'pointer', background: '#f0f2f5', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' };
const dropdownStyle = { position: 'absolute', right: 0, top: '45px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', width: '200px', zIndex: 100 };
const dropItem = { padding: '12px', cursor: 'pointer', display: 'block', textDecoration: 'none', color: '#333', borderBottom: '1px solid #f0f2f5' };
const scrollContainer = { display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px 0' };
const itemCard = { minWidth: '220px', background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' };
const imgStyle = { width: '100%', height: '140px', objectFit: 'contain' };
const containerStyle = { display: 'flex', justifyContent: 'center', padding: '100px 20px' };
const cardStyle = { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', width: '350px' };
const inpStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const navBtn = { padding: '10px 20px', background: '#1a73e8', color: '#fff', borderRadius: '8px', textDecoration: 'none' };