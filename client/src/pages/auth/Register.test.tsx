import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { register } from "../../services/auth.service";
import Register from "./Register";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("react-toastify");
jest.mock("../../services/auth.service");

describe("Composant Register", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("doit enregistrer l'utilisateur et naviguer vers login", async () => {
    (register as jest.Mock).mockResolvedValue({});

    render(<Register />);

    // 1. On remplit le formulaire
    fireEvent.change(screen.getByPlaceholderText(/Saisissez votre email/i), {
      target: { value: "new@test.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Saisissez votre mot de passe/i),
      { target: { value: "password123" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Saisissez le à nouveau/i), {
      target: { value: "password123" },
    });

    // 2. On clique sur le bouton d'inscription
    const submitBtn = screen.getByRole("button", { name: /Créer mon compte/i });
    fireEvent.click(submitBtn);

    // 3. On vérifie que l'inscription a été appelée et la navigation effectuée
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("new@test.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("doit afficher un toast en cas d'erreur d'inscription", async () => {
    (register as jest.Mock).mockRejectedValue(new Error("User already exists"));
    const toastSpy = jest.spyOn(toast, "error");

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/Saisissez votre email/i), {
      target: { value: "error@test.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Saisissez votre mot de passe/i),
      { target: { value: "password" } }
    );
    fireEvent.change(screen.getByPlaceholderText(/Saisissez le à nouveau/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Créer mon compte/i }));

    await waitFor(() => {
      expect(toastSpy).toHaveBeenCalledWith(
        expect.stringContaining("Échec de l'inscription")
      );
    });
  });

  it("doit naviguer vers la page de connexion", () => {
    render(<Register />);
    const loginBtn = screen.getByRole("button", {
      name: /Déjà un compte/i,
    });

    fireEvent.click(loginBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
