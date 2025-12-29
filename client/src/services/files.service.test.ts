import api from "./index";
import {
  uploadFile,
  getfiles,
  getFileMeta,
  downloadFile,
  deleteFile,
} from "./files.service";

jest.mock("./index", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Files Service", () => {
  it("doit envoyer un FormData correct lors de l'upload", async () => {
    const file = new File(["content"], "test.png", { type: "image/png" });
    const date = new Date("2025-12-31");
    const mockRes = { id: "uuid-1", name: "test.png" };

    (api.post as jest.Mock).mockResolvedValue({ data: mockRes });

    const result = await uploadFile(file, date, "password123");

    // On vérifie le deuxième argument de api.post (le FormData)
    const formDataSent = (api.post as jest.Mock).mock.calls[0][1];

    expect(formDataSent.get("file")).toEqual(file);
    expect(formDataSent.get("password")).toBe("password123");
    expect(api.post).toHaveBeenCalledWith(
      "/api/files/upload",
      expect.any(FormData),
      expect.any(Object)
    );
    expect(result).toEqual(mockRes);
  });

  it("doit gérer les erreurs lors de l'upload", async () => {
    const file = new File(["content"], "test.png", { type: "image/png" });
    const date = new Date("2025-12-31");

    (api.post as jest.Mock).mockRejectedValue(new Error("Upload failed"));

    await expect(uploadFile(file, date)).rejects.toThrow("Upload failed");
  });

  it("doit récupérer la liste des fichiers", async () => {
    const mockFiles = [
      { id: "uuid-1", name: "file1.png" },
      { id: "uuid-2", name: "file2.jpg" },
    ];

    (api.get as jest.Mock).mockResolvedValue({ data: mockFiles });

    const result = await getfiles();

    expect(api.get).toHaveBeenCalledWith("/api/files");
    expect(result).toEqual(mockFiles);
  });

  it("doit gérer les erreurs lors de la récupération des fichiers", async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    await expect(getfiles()).rejects.toThrow("Fetch failed");
  });

  it("doit appeler getFileMeta avec les bons paramètres", async () => {
    const mockFileMeta = { id: "uuid-1", name: "file1.png" };
    (api.get as jest.Mock).mockResolvedValue({ data: mockFileMeta });

    const fileId = "uuid-1";
    const password = "secret";
    const result = await getFileMeta(fileId, password);

    expect(api.get).toHaveBeenCalledWith(`/api/share/${fileId}`, {
      params: { password },
    });
    expect(result).toEqual(mockFileMeta);
  });

  it("deleteFile() doit appeler l'ID correct et terminer l'exécution", async () => {
    (api.delete as jest.Mock).mockResolvedValue({ data: {} });

    await deleteFile("uuid-test-123");

    expect(api.delete).toHaveBeenCalledWith("/api/files/uuid-test-123");
    expect(api.delete).toHaveBeenCalledTimes(1);
  });

  it("doit appeler downloadFile avec les bons paramètres", async () => {
    const mockBlob = new Blob(["file content"], {
      type: "application/octet-stream",
    });
    (api.get as jest.Mock).mockResolvedValue({ data: mockBlob });

    const fileId = "uuid-1";
    const password = "secret";
    const result = await downloadFile(fileId, password);

    expect(api.get).toHaveBeenCalledWith(`/api/share/${fileId}/download`, {
      params: { password },
      responseType: "blob",
    });
    expect(result).toEqual(mockBlob);
  });
});
