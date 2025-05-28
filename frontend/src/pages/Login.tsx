import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [token, setToken] = React.useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      alert('Uspešna prijava!');
    } else {
      alert('Neuspešna prijava.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
      <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Prijava</button>
      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default Login;
