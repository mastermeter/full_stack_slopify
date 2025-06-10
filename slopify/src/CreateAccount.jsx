import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert
} from '@mui/material';

export default function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // pour envoyer les cookies avec la requête
      });

      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (res.status === 400) {
        setError("Adresse email déjà utilisée.");
      } else {
        setError("Erreur lors de la création du compte.");
      }
    } catch (err) {
      setError("Erreur lors de la création du compte.");
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: 'auto', padding: 4, mt: 8 }}>
      <Typography variant="h5" gutterBottom>Créer un compte</Typography>
      
      <form onSubmit={handleSignup}>
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
        {success && <Alert severity="success" sx={{ mt: 2 }}>Compte créé avec succès !</Alert>}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, backgroundColor: "#0a0f49" }}
          type="submit"
        >
          Créer un compte
        </Button>
        <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => {
                window.location.href = '/login';
            }}
        >
        Annuler
        </Button>

      </form>
    </Paper>
  );
}
