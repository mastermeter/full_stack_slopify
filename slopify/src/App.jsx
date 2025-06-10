import "./App.css";
import Map from "./Map.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Login.jsx";
import Signup from "./CreateAccount.jsx"; // Importe ton composant signup
import { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx"; // Assurez-vous que Navbar est importé
import UserContext from "./UserContext.jsx";
import { useMe } from "./useMe.jsx"; // Assurez-vous que useMe est importé
import Events from "./Events.jsx"; // Assurez-vous que Events est importé
import MyEvents from "./MyEvents.jsx"; // Assurez-vous que MyEvents est importé

export default function App() {
  const { me, refetchMe, loading } = useMe(); // Récupère l'utilisateur courant et la fonction pour rafraîchir
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effet pour mettre à jour l'état d'authentification dès que `me` change

  useEffect(() => {
    console.log("me", me);
    if (me) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [me]);

  if (loading) {
    // Affiche un chargement si les données de l'utilisateur sont en cours de récupération
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ me, refetchMe }}>
      <BrowserRouter>
        {/* Affichage conditionnel de la Navbar */}
        {<Navbar isAuthenticated={isAuthenticated} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Map />} />
              <Route path="/carte" element={<Map />} />
              <Route path="/events" element={<Events />} />
              <Route path="/myevents" element={<MyEvents />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
      </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
