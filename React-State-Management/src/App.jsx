import React from 'react';
import Counter from './components/Counter';
import PasswordToggle from './components/PasswordToggle';
import ThemeSwitcher from './components/ThemeSwitcher';
import ControlledInput from './components/ControlledInput';
import TodoList from './components/TodoList';
import RegistrationForm from './components/RegistrationForm';

import './App.css';

const App = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React State Management Examples</h1>
      <p>Exploring different use cases for the <code>useState</code> hook.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <Counter />
        <PasswordToggle />
        <ThemeSwitcher />
        <ControlledInput />
        <TodoList />
        <RegistrationForm />
      </div>
    </div>
  );
}

export default App;