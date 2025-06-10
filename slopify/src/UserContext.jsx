import { createContext } from "react";

const UserContext = createContext({
    me: null,
    refetchMe: () => {}, // Fonction par défaut pour rafraîchir les données de l'utilisateur
});

export default UserContext;
