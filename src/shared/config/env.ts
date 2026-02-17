export const env = {
  API_URL: (import.meta as any).env.VITE_API_URL as string,
};

if (!env.API_URL) {
  throw new Error("Missing VITE_API_URL");
}
