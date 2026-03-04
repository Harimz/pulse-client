import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "./follows.client";
import { profileKeys } from "@/modules/profile/api/profile.keys";
import type { PublicUserProfileResponse } from "@/modules/profile/domain/profile.schemas";
import { ApiError } from "@/shared/api/api-error";
import { toast } from "sonner";
import { feedKeys } from "@/modules/feeds/api/feeds.keys";

export const useToggleFollow = (username: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { currentlyFollowing: boolean }) => {
      if (vars.currentlyFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    },
    onMutate: async ({ currentlyFollowing }) => {
      await qc.cancelQueries({ queryKey: profileKeys.byUsername(username) });

      const previousProfile = qc.getQueryData<PublicUserProfileResponse>(
        profileKeys.byUsername(username),
      );

      qc.setQueryData(
        profileKeys.byUsername(username),
        (old: PublicUserProfileResponse | undefined) => {
          if (!old) return old;

          const delta = currentlyFollowing ? -1 : 1;
          return {
            ...old,
            isFollowing: !currentlyFollowing,
            followers: Math.max(0, old.followers + delta),
          };
        },
      );

      return { previousProfile };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previousProfile) {
        qc.setQueryData(profileKeys.byUsername(username), ctx.previousProfile);
      }

      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Failed to update follow status");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: profileKeys.byUsername(username) });
      qc.invalidateQueries({ queryKey: feedKeys.all });
    },
  });
};
