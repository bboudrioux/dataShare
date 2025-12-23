interface FileMeta {
  id: string;
  name: string;
  type: string;
  size: number;
  password: string | null;
  created_date: Date;
  expiration_date: Date;
  user_id: string | null;
  status: "valide" | "expiré";
  hasPassword: boolean;
}

export type { FileMeta };
