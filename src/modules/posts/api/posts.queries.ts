import { useQuery } from "@tanstack/react-query";
import { getPostById, getPostComments } from "./posts.client";
import { postsKeys } from "./posts.keys";
import type {
  CommentsCursorPageResponse,
  PostResponse,
} from "../domain/posts.schemas";

export const usePostById = (postId: string) => {
  return useQuery<PostResponse>({
    queryKey: postsKeys.detail(postId),
    queryFn: () => getPostById(postId),
  });
};

export const usePostComments = (postId: string, limit = 20) => {
  return useQuery<CommentsCursorPageResponse>({
    queryKey: postsKeys.comments(postId, limit),
    queryFn: () => getPostComments({ postId, limit }),
    staleTime: 15_000,
  });
};
