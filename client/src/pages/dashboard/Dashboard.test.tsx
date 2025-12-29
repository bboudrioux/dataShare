import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useNavigate, useOutletContext } from "react-router";
import { getfiles, deleteFile } from "../../services/files.service";
import Dashboard from "./Dashboard";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
  useOutletContext: jest.fn(),
}));
jest.mock("react-toastify");
jest.mock("../../services/files.service");

const mockFiles = [
  {
    id: "1",
    name: "vacances.jpg",
    status: "valide",
    expiration_date: "2025-12-31",
    hasPassword: true,
  },
];

describe("Composant Dashboard", () => {
  const mockNavigate = jest.fn();
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useOutletContext as jest.Mock).mockReturnValue({ setToken: mockSetToken });
    (getfiles as jest.Mock).mockResolvedValue(mockFiles);
  });

  it("doit fermer la modale avec la touche Échap", async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Ouvrir la modale
    await act(async () => {
      fireEvent(window, new CustomEvent("open-upload-modal"));
    });

    // Vérifier que la modale est ouverte
    const closeButtons = screen.getAllByRole("button", { name: "×" });
    expect(closeButtons.length).toBeGreaterThan(0);

    // Simuler Échap
    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
    });

    await waitFor(() => {
      // On vérifie que la modale "Ajouter un fichier" n'est plus là
      expect(screen.queryByText(/Ajouter un fichier/i)).not.toBeInTheDocument();
    });
  });

  it("doit supprimer un fichier après confirmation", async () => {
    (deleteFile as jest.Mock).mockResolvedValue({});

    await act(async () => {
      render(<Dashboard />);
    });

    // 1. Cliquer sur le bouton "Supprimer" de la ligne (le premier trouvé)
    const deleteActionButtons = await screen.findAllByRole("button", {
      name: /Supprimer/i,
    });
    fireEvent.click(deleteActionButtons[0]);

    // 2. Cliquer sur le bouton de confirmation dans la modale
    const confirmBtn = screen
      .getAllByRole("button", { name: /^Supprimer$/i })
      .find((btn) => btn.classList.contains("btn-danger"));

    if (!confirmBtn) throw new Error("Bouton de confirmation non trouvé");

    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      expect(deleteFile).toHaveBeenCalledWith("1");
    });
  });
});
