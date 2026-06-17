import React, { useState } from 'react';

function TodoList() {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);

  const handleAddTask = () => {
    if (task.trim() !== "") {
      setList([...list, task]);
      setTask(""); // Clear input after adding
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '8px' }}>
      <h2>My Tasks (Array State)</h2>
      <input 
        type="text" 
        placeholder="New task..." 
        value={task} 
        onChange={(e) => setTask(e.target.value)} 
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={handleAddTask}>Add Task</button>
      
      <ul style={{ textAlign: 'left', marginTop: '10px' }}>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
