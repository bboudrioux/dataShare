import api from "./index";
import type { FileMeta } from "../types/files.types";

export const uploadFile = async (
  file: File,
  expirationDate: Date,
  password?: string
): Promise<FileMeta> => {
  const formData = new FormData();
  formData.append("file", file);
  const expiration = new Date(expirationDate).toString();
  formData.append("expiration_date", expiration);
  if (password) formData.append("password", password);

  const response = await api.post<FileMeta>("/api/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getfiles = async (): Promise<FileMeta[]> => {
  const response = await api.get<FileMeta[]>("/api/files");
  return response.data;
};

export const getFileMeta = async (
  fileId: string,
  password?: string
): Promise<FileMeta> => {
  const response = await api.get<FileMeta>(`/api/share/${fileId}`, {
    params: { password },
  });
  return response.data;
};

export const deleteFile = async (fileId: string): Promise<void> => {
  await api.delete(`/api/files/${fileId}`);
};

export const downloadFile = async (fileId: string, password?: string) => {
  const response = await api.get(`/api/share/${fileId}/download`, {
    params: { password },
    responseType: "blob",
  });
  return response.data;
};
