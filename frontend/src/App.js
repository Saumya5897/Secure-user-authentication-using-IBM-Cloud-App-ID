import React, { useState } from 'react';
import { initAuth } from './auth';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleLogin = async () => {
    const result = await initAuth();
    if (result) {
      const { userInfo } = result;
      setIsLoggedIn(true);
      setUserInfo(userInfo);

      fetch('http://localhost:5000/goals')
        .then(res => res.json())
        .then(data => setGoals(data));
    }
  };

  const addGoal = () => {
    fetch('http://localhost:5000/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: newGoal })
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setGoals(prev => [...prev, data.data]);
          setNewGoal('');
        }
      });
  };

  const deleteGoal = (id) => {
    fetch(`http://localhost:5000/goals/${id}`, { method: 'DELETE' })
      .then(() => setGoals(goals.filter(g => g._id !== id)));
  };

  const updateGoal = () => {
    fetch(`http://localhost:5000/goals/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText })
    })
      .then(res => res.json())
      .then(updated => {
        const updatedGoals = goals.map(g => g._id === updated._id ? updated : g);
        setGoals(updatedGoals);
        setEditingId(null);
        setEditText('');
      });
  };

  const toggleComplete = (id, currentStatus) => {
    fetch(`http://localhost:5000/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    })
      .then(res => res.json())
      .then(updated => {
        const updatedGoals = goals.map(g =>
          g._id === updated._id ? { ...g, completed: updated.completed } : g
        );
        setGoals(updatedGoals);
      });
  };

  const total = goals.length;
  const completed = goals.filter(g => g.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (!isLoggedIn) {
    return (
      <div className="container login">
        <h1>Login to Goal Tracker 🧠</h1>
        <button className="login-btn" onClick={handleLogin}>🔐 Login with IBM App ID</button>
      </div>
    );
  }

  return (
    <div className="main-wrapper logged-in">
      <div className="container">
        <div className="header">
          <h1>🎯 Goal Tracker</h1>
          <button className="logout-btn" onClick={() => {
            setIsLoggedIn(false);
            setUserInfo(null);
          }}>🚪 Logout</button>
        </div>
        <h3>Welcome, {userInfo?.name || userInfo?.email}</h3>

        <form className="input-section" onSubmit={e => { e.preventDefault(); addGoal(); }}>
          <input
            type="text"
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            placeholder="New goal..."
            required
          />
          <button type="submit" className="add-btn">➕</button>
        </form>

        <p className="progress">
          📊 Progress: {progress}% completed
        </p>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <ul className="goal-list">
          {goals.map((g) => (
            <li key={g._id} className={`goal-item ${g.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={g.completed}
                onChange={() => toggleComplete(g._id, g.completed)}
              />
              <div className="goal-info">
                {editingId === g._id ? (
                  <>
                    <input value={editText} onChange={e => setEditText(e.target.value)} />
                    <button onClick={updateGoal}>💾</button>
                  </>
                ) : (
                  <>
                    <strong>{g.text}</strong>
                  </>
                )}
              </div>
              <div className="goal-actions">
                <button onClick={() => {
                  setEditingId(g._id);
                  setEditText(g.text);
                }}>✏️</button>
                <button onClick={() => deleteGoal(g._id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

