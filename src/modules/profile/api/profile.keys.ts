export const profileKeys = {
  all: ["profile"] as const,
  byUsername: (username: string) =>
    [...profileKeys.all, "byUsername", username] as const,
  me: () => [...profileKeys.all, "me"] as const,

  posts: (username: string, limit = 10) =>
    [...profileKeys.all, "posts", username, { limit }] as const,
};
