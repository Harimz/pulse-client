import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { ApiError } from "@/shared/api/api-error";
import { createPost, createPostComment, likePost, unlikePost } from "./posts.client";
import { toast } from "sonner";
import { feedKeys } from "@/modules/feeds/api/feeds.keys";
import { postsKeys } from "./posts.keys";
import type {
  CommentResponse,
  CommentsCursorPageResponse,
  PostResponse,
} from "../domain/posts.schemas";
import { profileKeys } from "@/modules/profile/api/profile.keys";

type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type LikeablePost = {
  id: string;
  likedByMe: boolean;
  likesCount: number;
};

const isDuplicateLikeError = (err: unknown, nextLiked: boolean) => {
  if (!nextLiked) return false;
  if (!(err instanceof ApiError)) return false;

  const msg = err.message.toLowerCase();
  return (
    err.status === 409 ||
    msg.includes("already liked") ||
    msg.includes("duplicate")
  );
};

export const useCreatePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: feedKeys.all });
      toast.success("Post created");
    },
    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Something went wrong");
    },
  });
};

export const useToggleLikePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { postId: string; nextLiked: boolean }) => {
      if (vars.nextLiked) await likePost(vars.postId);
      else await unlikePost(vars.postId);
    },

    onMutate: async ({ postId, nextLiked }) => {
      await qc.cancelQueries({ queryKey: feedKeys.all });
      await qc.cancelQueries({ queryKey: postsKeys.detail(postId) });

      const snapshots = qc.getQueriesData({ queryKey: feedKeys.all });
      const detailSnapshot = qc.getQueryData<PostResponse>(
        postsKeys.detail(postId),
      );

      qc.setQueriesData({ queryKey: feedKeys.all }, (old: unknown): unknown => {
        const data = old as InfiniteData<CursorPage<LikeablePost>> | undefined;
        if (!data?.pages?.length) return old;

        let changed = false;

        const pages = data.pages.map((page) => {
          let pageChanged = false;

          const items = page.items.map((p) => {
            if (p.id !== postId) return p;
            if (p.likedByMe === nextLiked) return p;

            pageChanged = true;
            changed = true;

            const nextCount = nextLiked
              ? p.likesCount + 1
              : Math.max(0, p.likesCount - 1);

            return {
              ...p,
              likedByMe: nextLiked,
              likesCount: nextCount,
            };
          });

          return pageChanged ? { ...page, items } : page;
        });

        return changed ? { ...data, pages } : old;
      });

      qc.setQueryData(postsKeys.detail(postId), (old: PostResponse | undefined) => {
        if (!old) return old;
        if (old.likedByMe === nextLiked) return old;

        return {
          ...old,
          likedByMe: nextLiked,
          likesCount: nextLiked
            ? old.likesCount + 1
            : Math.max(0, old.likesCount - 1),
        };
      });

      return { snapshots, detailSnapshot, postId };
    },

    onError: (err, vars, ctx) => {
      if (isDuplicateLikeError(err, vars.nextLiked)) {
        qc.setQueriesData({ queryKey: feedKeys.all }, (old: unknown): unknown => {
          const data = old as InfiniteData<CursorPage<LikeablePost>> | undefined;
          if (!data?.pages?.length) return old;

          const pages = data.pages.map((page) => ({
            ...page,
            items: page.items.map((p) =>
              p.id === vars.postId ? { ...p, likedByMe: true } : p,
            ),
          }));

          return { ...data, pages };
        });

        qc.setQueryData(postsKeys.detail(vars.postId), (old: PostResponse | undefined) => {
          if (!old) return old;
          return { ...old, likedByMe: true };
        });

        return;
      }

      if (ctx?.snapshots) {
        for (const [key, data] of ctx.snapshots) {
          qc.setQueryData(key, data);
        }
      }

      if (ctx?.detailSnapshot && ctx.postId) {
        qc.setQueryData(postsKeys.detail(ctx.postId), ctx.detailSnapshot);
      }

      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to update like");
    },

    onSettled: (_data, error, vars) => {
      qc.invalidateQueries({ queryKey: feedKeys.all });

      if (!isDuplicateLikeError(error, vars.nextLiked)) {
        qc.invalidateQueries({ queryKey: postsKeys.detail(vars.postId) });
      }
    },
  });
};

export const useCreatePostComment = (postId: string, limit = 20) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { body: string }) =>
      createPostComment({ postId, body: vars.body }),
    onSuccess: (newComment: CommentResponse) => {
      qc.setQueryData(
        postsKeys.comments(postId, limit),
        (old: CommentsCursorPageResponse | undefined) => {
          if (!old) {
            return { items: [newComment], nextCursor: null };
          }

          return {
            ...old,
            items: [newComment, ...old.items],
          };
        },
      );

      qc.setQueryData(
        postsKeys.detail(postId),
        (old: PostResponse | undefined): PostResponse | undefined => {
          if (!old) return old;
          return { ...old, commentCount: old.commentCount + 1 };
        },
      );

      qc.invalidateQueries({ queryKey: feedKeys.all });
      qc.invalidateQueries({ queryKey: [...profileKeys.all, "posts"] });
    },
    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to post comment");
    },
  });
};
