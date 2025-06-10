import { useEffect, useState } from "react";

export const useMe = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Gérer les erreurs

  // Déplace la fonction fetchUser ici pour qu'elle soit accessible dans refetchMe
  const fetchUser = async () => {

    try {
      const response = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Stocker les données de l'utilisateur dans le state
        console.log("Utilisateur récupéré :", data); // Afficher les données de l'utilisateur dans la console
      } else {
        setError("Utilisateur non autorisé");
      }
    } catch (error) {
      setError("Erreur lors de la récupération des données utilisateur");
      console.error(error);
    } finally {
      setLoading(false);
    }
  
  };

  useEffect(() => {
    fetchUser(); // Appel de fetchUser lorsque le composant est monté
  }, []); // Se lance une seule fois au montage du composant

  const refetchMe = () => {
    setLoading(true);
    setUser(null); // Effacer les données actuelles avant de recharger
    setError(null); // Réinitialiser l'erreur
    fetchUser(); // Relancer la récupération des données
  };

  return { me:user, loading, error, refetchMe };
};
