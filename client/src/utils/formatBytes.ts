function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const base = 1024; // Use 1000 for the decimal (SI) standard if preferred
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, unitIndex);
  const formattedValue = value.toFixed(decimals);

  // Use parseFloat to remove trailing zeros if needed
  return `${parseFloat(formattedValue)} ${units[unitIndex]}`;
}
export default formatBytes;
