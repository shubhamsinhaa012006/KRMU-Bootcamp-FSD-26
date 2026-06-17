import React, { useState } from 'react';

function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  const themeStyles = {
    backgroundColor: isDark ? '#333' : '#FFF',
    color: isDark ? '#FFF' : '#333',
    padding: '20px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
    borderRadius: '8px'
  };

  return (
    <div style={themeStyles}>
      <h2>{isDark ? "Dark Mode Active" : "Light Mode Active"}</h2>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Theme
      </button>
    </div>
  );
}

export default ThemeSwitcher;
