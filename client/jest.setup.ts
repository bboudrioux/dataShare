import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Mock de l'API URL pour Vite/Jest
process.env.API_URL = "http://localhost:3000";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder as unknown as typeof global.TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
}
