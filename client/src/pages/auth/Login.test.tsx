import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { login } from "../../services/auth.service";
import Login from "./Login";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
  useOutletContext: jest.fn(),
}));
jest.mock("react-toastify");
jest.mock("../../services/auth.service");

describe("Composant Login", () => {
  const mockNavigate = jest.fn();
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useOutletContext as jest.Mock).mockReturnValue({ setToken: mockSetToken });
  });

  it("doit remplir le formulaire et naviguer vers dashboard après succès", async () => {
    const mockResponse = { access_token: "fake-token" };
    (login as jest.Mock).mockResolvedValue(mockResponse);

    render(<Login />);

    // 1. Saisie de l'email et du mot de passe (couvre les onChange du LoginForm)
    const emailInput = screen.getByPlaceholderText(/Saisissez votre email/i);
    const passwordInput = screen.getByPlaceholderText(
      /Saisissez votre mot de passe/i
    );

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // 2. Clic sur le bouton "Connexion"
    const loginBtn = screen.getByRole("button", { name: /Se connecter/i });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockSetToken).toHaveBeenCalledWith("fake-token");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("doit afficher une erreur toast si la connexion échoue", async () => {
    // 1. On prépare le service pour qu'il rejette la promesse
    (login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));
    const toastSpy = jest.spyOn(toast, "error");

    render(<Login />);

    // 2. On remplit le formulaire avec des données invalides
    fireEvent.change(screen.getByPlaceholderText(/Saisissez votre email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Saisissez votre mot de passe/i),
      {
        target: { value: "wrongpassword" },
      }
    );

    // 3. On clique sur connexion
    const loginBtn = screen.getByRole("button", { name: /Se connecter/i });
    fireEvent.click(loginBtn);

    // 4. On attend que le toast soit appelé
    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.stringContaining("Échec de la connexion")
      );
    });
  });

  it("doit naviguer vers la page d'inscription", () => {
    render(<Login />);
    const registerBtn = screen.getByRole("button", {
      name: /Créer un compte/i,
    });

    fireEvent.click(registerBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});
