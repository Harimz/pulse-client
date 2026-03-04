import { queryOptions } from "@tanstack/react-query";
import { profileKeys } from "./profile.keys";
import { getPublicProfile } from "./profile.client";

export const publicProfileOptions = (username: string, cookie?: string) => {
  return queryOptions({
    queryKey: profileKeys.byUsername(username),
    queryFn: () => getPublicProfile(username, { cookie }),
    staleTime: 30_000,
  });
};
