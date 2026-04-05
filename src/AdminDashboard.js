import React, { useState } from 'react';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('03183102571z1');
  
  // Product state with media support
  const [product, setProduct] = useState({ 
    title: '', 
    price: '', 
    link: '', 
    mediaUrl: '', 
    mediaType: 'image' // 'image' ya 'video'
  });

  const ADMIN_EMAIL = "admin@zaibii.com";
  const ADMIN_PASS = "zaibii786"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsLoggedIn(true);
    } else {
      alert("Ghalat Password!");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    // Yahan humne 'link' ko check nahi kiya, sirf title zaroori rakha hai
    if (!product.title || !product.mediaUrl) {
      alert("Kam az kam Title aur Image/Video URL lazmi dalein!");
      return;
    }
    
    console.log("Product Ready to Upload:", product);
    alert("Product Upload Ho Gaya! (Check Console for Data)");
    
    // Form reset
    setProduct({ title: '', price: '', link: '', mediaUrl: '', mediaType: 'image' });
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{display:'block', margin:'10px auto', padding:'10px'}}/>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={{display:'block', margin:'10px auto', padding:'10px'}}/>
          <button type="submit" style={{padding:'10px 20px', cursor:'pointer'}}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Zaibii Admin Panel</h1>
      
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h3>Naya Product (Deal) Add Karein</h3>
        <form onSubmit={handleAddProduct}>
          <input type="text" placeholder="Product Name" value={product.title} onChange={(e) => setProduct({...product, title: e.target.value})} style={{width:'90%', margin:'10px 0', padding:'10px'}} required />
          
          <input type="text" placeholder="Price (e.g. Rs. 1500)" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} style={{width:'90%', margin:'10px 0', padding:'10px'}} />
          
          <input type="text" placeholder="Affiliate Link (Optional)" value={product.link} onChange={(e) => setProduct({...product, link: e.target.value})} style={{width:'90%', margin:'10px 0', padding:'10px'}} />
          
          <input type="text" placeholder="Image or Video URL" value={product.mediaUrl} onChange={(e) => setProduct({...product, mediaUrl: e.target.value})} style={{width:'90%', margin:'10px 0', padding:'10px'}} required />
          
          <div style={{margin: '10px 0'}}>
            <label>Media Type: </label>
            <select value={product.mediaType} onChange={(e) => setProduct({...product, mediaType: e.target.value})} style={{padding:'5px'}}>
              <option value="image">Image (JPG/PNG)</option>
              <option value="video">Video (MP4/Link)</option>
            </select>
          </div>

          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', padding: '15px 30px', border:'none', borderRadius:'5px', cursor: 'pointer', fontSize:'16px' }}>
            Upload Product
          </button>
        </form>
      </div>

      <hr style={{margin: '40px 0'}} />

      <h3>Preview (Kaisa dikhega):</h3>
      <div style={{ border: '1px solid #ddd', padding: '15px', width: '300px', borderRadius: '10px', textAlign:'center' }}>
        {product.mediaType === 'image' ? (
          <img src={product.mediaUrl || 'https://via.placeholder.com/150'} alt="preview" style={{width: '100%', borderRadius: '5px'}} />
        ) : (
          <video src={product.mediaUrl} controls style={{width: '100%', borderRadius: '5px'}} />
        )}
        <h4>{product.title || "Product Name"}</h4>
        <p style={{color: 'green', fontWeight:'bold'}}>{product.price || "Price TBD"}</p>
        {product.link && <button style={{backgroundColor: '#ff9900', border:'none', padding: '10px', color:'white', borderRadius:'5px'}}>Buy Now</button>}
      </div>
    </div>
  );
};

export default AdminDashboard;
