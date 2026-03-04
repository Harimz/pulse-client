export const postsKeys = {
  all: ["posts"] as const,
  detail: (postId: string) => [...postsKeys.all, "detail", postId] as const,
  comments: (postId: string, limit = 20) =>
    [...postsKeys.all, "comments", postId, { limit }] as const,
};
