import api from "./index";
import { login, register } from "./auth.service";

// On mock l'instance par défaut exportée de index.ts
jest.mock("./index", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("Auth Service", () => {
  const mockAuthResponse = {
    token: "jwt-123",
    user: { email: "test@test.com" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("doit appeler register et retourner les données", async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockAuthResponse });

    const result = await register("test@test.com", "password");

    expect(api.post).toHaveBeenCalledWith("/api/auth/register", {
      email: "test@test.com",
      password: "password",
    });
    expect(result).toEqual(mockAuthResponse);
  });

  it("doit appeler login et retourner les données", async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockAuthResponse });

    const result = await login("test@test.com", "password");

    expect(api.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "test@test.com",
      password: "password",
    });
    expect(result).toEqual(mockAuthResponse);
  });
});
