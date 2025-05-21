import React from 'react';
import { ItemList } from './components';
import './components/styles.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tolerance Manager</h1>
      </header>
      <main>
        <ItemList />
      </main>
    </div>
  );
}

export default App;
