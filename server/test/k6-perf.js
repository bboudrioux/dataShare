import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

// 1. CONFIGURATION DES STAGES (Charge progressive)
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Monter à 10 utilisateurs simultanés
    { duration: '1m', target: 10 }, // Maintenir la charge
    { duration: '30s', target: 0 }, // Redescendre
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // Moins de 1% d'échec
    http_req_duration: ['p(95)<2000'], // 95% des requêtes sous les 2s
  },
};

// Contenu binaire simulé (évite l'erreur de fichier inexistant)
const dummyContent = 'Ceci est un contenu de test généré dynamiquement par k6.';

// 2. SETUP : On se connecte une seule fois pour récupérer le Token
export function setup() {
  const payload = JSON.stringify({
    email: 'perftest@k6.fr',
    password: 'azerty',
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  http.post('http://localhost:3000/api/auth/register', payload, params);
  const res = http.post(
    'http://localhost:3000/api/auth/login',
    payload,
    params,
  );

  // Vérification de l'auth
  if (res.status !== 201) {
    throw new Error(
      `Échec Auth: Statut ${res.status}. Vérifie tes identifiants !`,
    );
  }

  const token = res.json().access_token;
  return { token: token };
}

// 3. TEST : Upload des fichiers par les utilisateurs virtuels (VU)
export default function (data) {
  const url = 'http://localhost:3000/api/files/upload';

  // Préparation du formulaire Multipart
  const fd = new FormData();
  fd.append('file', http.file(dummyContent, 'perf-test.txt', 'text/plain'));
  fd.append('expiration_date', new Date(Date.now() + 86400000).toISOString());

  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
      'Content-Type': 'multipart/form-data; boundary=' + fd.boundary,
    },
  };

  const res = http.post(url, fd.body(), params);

  // Validation des résultats
  check(res, {
    'statut est 201': (r) => r.status === 201,
  });

  // Pause d'une seconde entre chaque upload par utilisateur
  sleep(1);
}
