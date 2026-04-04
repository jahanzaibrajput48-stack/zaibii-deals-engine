import React, { useState } from "react";
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Ye hamara temporary database hai (Kal hum ise Google Sheets se connect kar sakte hain)
  const allProducts = [
    {
      id: 1,
      name: "M10 TWS Earbuds - Noise Cancelling",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Sample Video
      rating: "4.5",
      reviews: "2,400",
      image: "https://via.placeholder.com/150",
      deals: [
        { store: "AliExpress", price: 850, link: "#", type: "Non-Affiliate" },
        { store: "Daraz", price: 1250, link: "#", type: "Affiliate" },
        { store: "Amazon", price: 1800, link: "#", type: "Affiliate" }
      ].sort((a, b) => a.price - b.price) // Sasta pehle dikhane ka logic
    },
    {
      id: 2,
      name: "Ultra Smart Watch Series 9",
      video: "#",
      rating: "4.8",
      reviews: "950",
      image: "https://via.placeholder.com/150",
      deals: [
        { store: "Amazon", price: 4500, link: "#", type: "Affiliate" },
        { store: "Shopify Store", price: 3800, link: "#", type: "Non-Affiliate" },
        { store: "AliExpress", price: 3200, link: "#", type: "Non-Affiliate" }
      ].sort((a, b) => a.price - b.price)
    }
  ];

  return (
    <div style={{ backgroundColor: "#f1f3f4", minHeight: "100vh", fontFamily: "Roboto, sans-serif" }}>
      <SpeedInsights />
      {/* Search Header */}
      <div style={{ backgroundColor: "#fff", padding: "40px 20px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ margin: "0", color: "#4285F4", fontSize: "2.5rem" }}>Zaibii Global Search</h1>
        <p style={{ color: "#5f6368" }}>Internet ki har product, sabse sasti qimat mein.</p>
        <input 
          type="text" 
          placeholder="Search anything (e.g. iPhone, Shoes, Watch)..." 
          style={{ width: "100%", maxWidth: "600px", padding: "15px 25px", borderRadius: "30px", border: "1px solid #dfe1e5", marginTop: "20px", fontSize: "16px", outline: "none" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Results Section */}
      <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
          {allProducts
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(product => (
              <div key={product.id} style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#202124" }}>{product.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                    <span style={{ color: "#fbbc05", fontWeight: "bold" }}>⭐ {product.rating}</span>
                    <span style={{ color: "#70757a", fontSize: "13px" }}>({product.reviews} reviews)</span>
                  </div>

                  {/* Video/Image Placeholder */}
                  <div style={{ width: "100%", height: "180px", background: "#eee", borderRadius: "8px", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#999" }}>Product Video / Image</p>
                  </div>

                  <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Price Comparison:</p>
                  {product.deals.map((deal, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderRadius: "8px", backgroundColor: index === 0 ? "#e6f4ea" : "#f8f9fa", marginBottom: "5px" }}>
                      <span>
                        <strong>{deal.store}</strong>: Rs. {deal.price} 
                        {index === 0 && <span style={{ marginLeft: "10px", fontSize: "10px", color: "#1e8e3e", fontWeight: "bold" }}>✓ CHEAPEST</span>}
                      </span>
                      <a href={deal.link} style={{ color: "#1a73e8", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>Buy Now →</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}