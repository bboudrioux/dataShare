import axios from "axios";
import { API_URL } from "../constants";

let authToken = "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setApiToken = (token: string) => {
  authToken = token;
};

// Interceptor de Requête : Ajoute le token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Interceptor de Réponse : Gère la déconnexion sur 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.message?.includes(
        "Ce fichier nécessite un mot de passe"
      ) &&
      error.response.message?.includes("Mot de passe incorrect")
    ) {
      // On émet un événement pour informer React que la session est finie
      window.dispatchEvent(new CustomEvent("unauthorized-access"));
      authToken = "";
    }
    return Promise.reject(error);
  }
);

export default api;
