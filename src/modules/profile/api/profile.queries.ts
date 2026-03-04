import { useQuery } from "@tanstack/react-query";
import type { PublicUserProfileResponse } from "../domain/profile.schemas";
import { profileKeys } from "./profile.keys";
import { getProfilePosts, getPublicProfile } from "./profile.client";
import type { CursorPageResponse } from "@/modules/feeds/domain/feed.schemas";

export const usePublicUserProfile = (username: string) => {
  return useQuery<PublicUserProfileResponse>({
    queryKey: profileKeys.byUsername(username),
    queryFn: () => getPublicProfile(username),
  });
};

export const useProfilePosts = (username: string) => {
  return useQuery<CursorPageResponse>({
    queryKey: profileKeys.posts(username, 10),
    queryFn: () => getProfilePosts(username),
    staleTime: 30_000,
    retry: (count, err: any) => {
      if (err?.status === 401) return false;
      return count < 2;
    },
  });
};
