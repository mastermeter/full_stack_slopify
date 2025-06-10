// src/Login.jsx
import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useContext } from 'react';
import UserContext from './UserContext';
import { useNavigate } from 'react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { refetchMe } = useContext(UserContext); // Récupère la fonction pour rafraîchir les données de l'utilisateur


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
  
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      if (res.ok) {
        console.log(refetchMe())
        setSuccess(true);
        await refetchMe();      // ← pour déclencher l'affichage de la navbar + contenu
        navigate('/');          // ← pour aller à la page principale
      } else {
        const data = await res.json();
        setError(data.message || 'Erreur lors de la connexion.');
      }
    } catch (err) {
      console.error(err);
      setError('Échec de la connexion. Vérifiez votre email et mot de passe.');
    }
  };
  

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: 'auto', padding: 4, mt: 8 }}>
      <Typography variant="h5" gutterBottom>Connexion</Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Mot de passe"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Connexion réussie !</Alert>}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: '#0a0f49' }}
          type="submit"
        >
          Se connecter
        </Button>

        <Button
          fullWidth
          onClick={() => (window.location.href = '/signup')}
          sx={{ mt: 2, color: '#0a0f49' }}
        >
          Créer un compte
        </Button>
      </form>
    </Paper>
  );
}
