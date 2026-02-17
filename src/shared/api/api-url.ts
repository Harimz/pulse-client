const RAW = import.meta.env.VITE_API_URL as string;

export const API_URL = RAW.replace(/\/+$/, "");
