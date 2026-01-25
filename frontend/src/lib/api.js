// On définit l'adresse de votre nouveau serveur backend
const API_BASE_URL = "http://localhost:5000/api";

export const api = {
  // Récupérer les enfants
  getChildren: async () => {
    const response = await fetch(`${API_BASE_URL}/children`);
    return await response.json();
  },

  // Ajouter un enfant
  addChild: async (childData) => {
    const response = await fetch(`${API_BASE_URL}/children`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(childData),
    });
    return await response.json();
  }
};