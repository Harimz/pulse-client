export const feedKeys = {
  all: ["feeds"] as const,
  explore: (limit: number) => [...feedKeys.all, "explore", { limit }] as const,
  following: (limit: number) =>
    [...feedKeys.all, "following", { limit }] as const,
};
