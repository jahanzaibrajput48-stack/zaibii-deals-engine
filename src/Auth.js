import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid, name, phone, email, role: "worker", createdAt: new Date()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center' }}>{isSignup ? "Create Affiliate Account" : "Login"}</h2>
        {isSignup && (
          <>
            <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} style={inpStyle} required />
            <input type="text" placeholder="WhatsApp Number" onChange={e => setPhone(e.target.value)} style={inpStyle} required />
          </>
        )}
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={inpStyle} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={inpStyle} required />
        <button type="submit" style={btnStyle}>{isSignup ? "Register Now" : "Login"}</button>
        <p onClick={() => setIsSignup(!isSignup)} style={{ textAlign: 'center', cursor: 'pointer', color: '#1a73e8', marginTop: '15px' }}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
        </p>
      </form>
    </div>
  );
}

const inpStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };