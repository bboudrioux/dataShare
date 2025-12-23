const getExpiryLabel = (expirationDate: Date | string | number): string => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffInMs = expiry.getTime() - now.getTime();

  if (diffInMs <= 0) return "Expiré";

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 1) return `Expire dans ${diffInDays} jours`;
  if (diffInDays === 1) return "Expire demain";
  if (diffInHours >= 1)
    return `Expire dans ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
  return `Expire dans ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
};

const getExpiryLevel = (
  expiration: string | number | Date
): "info" | "warning" | "error" => {
  const expiryTime = new Date(expiration).getTime();
  const diff = expiryTime - Date.now();

  if (diff <= 0) return "error";
  if (diff < 24 * 3600 * 1000) return "warning"; // Moins de 24h
  return "info";
};

export { getExpiryLabel, getExpiryLevel };
