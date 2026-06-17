import React, { useState } from 'react';

function ControlledInput() {
  const [name, setName] = useState("");

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '8px' }}>
      <h2>Live Greeting (Controlled Input)</h2>
      <input 
        type="text" 
        placeholder="Type your name..." 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        style={{ padding: '5px' }}
      />
      <p>Hello, {name ? name : "Stranger"}!</p>
    </div>
  );
}

export default ControlledInput;
