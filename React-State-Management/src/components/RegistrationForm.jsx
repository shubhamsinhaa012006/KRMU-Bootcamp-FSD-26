import React, { useState } from 'react';

function RegistrationForm() {
  // Managing multiple inputs with a single state object
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Spread the existing state and update only the changed field
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted: \nUsername: ${formData.username}\nEmail: ${formData.email}\nAge: ${formData.age}`);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '8px' }}>
      <h2>Registration Form (Object State)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        
        <input 
          type="text" 
          name="username"
          placeholder="Username" 
          value={formData.username}
          onChange={handleChange}
          style={{ padding: '5px' }}
          required
        />
        
        <input 
          type="email" 
          name="email"
          placeholder="Email Address" 
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '5px' }}
          required
        />

        <input 
          type="number" 
          name="age"
          placeholder="Age" 
          value={formData.age}
          onChange={handleChange}
          style={{ padding: '5px' }}
          required
        />
        
        <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>Register</button>
      </form>
      
      <div style={{ marginTop: '15px', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
        <strong>Current State:</strong>
        <pre style={{ margin: 0 }}>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default RegistrationForm;
