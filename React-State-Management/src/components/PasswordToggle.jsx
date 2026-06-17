import React, { useState } from 'react';

function PasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '8px' }}>
      <h2>Login (Password Toggle)</h2>
      <input 
        type={showPassword ? "text" : "password"} 
        placeholder="Enter your password" 
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide Password" : "Show Password"}
      </button>
    </div>
  );
}

export default PasswordToggle;
