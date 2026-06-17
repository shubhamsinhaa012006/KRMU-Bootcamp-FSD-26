import React, { useState } from 'react';

function Counter() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '8px' }}>
      <h2>Cart Quantity: {quantity}</h2>
      <button onClick={() => setQuantity(quantity + 1)} style={{ marginRight: '10px' }}>Add Item</button>
      <button onClick={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}>Remove Item</button>
    </div>
  );
}

export default Counter;
