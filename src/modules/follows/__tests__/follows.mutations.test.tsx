import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithQuery } from "@/shared/test/utils/render";
import { useToggleFollow } from "../api/follows.mutations";
import { profileKeys } from "@/modules/profile/api/profile.keys";
import type { PublicUserProfileResponse } from "@/modules/profile/domain/profile.schemas";

const followUserMock = vi.fn();
const unfollowUserMock = vi.fn();

vi.mock("../api/follows.client", () => ({
  followUser: (...args: unknown[]) => followUserMock(...args),
  unfollowUser: (...args: unknown[]) => unfollowUserMock(...args),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const username = "alice";

const ToggleFollowTest = ({ currentlyFollowing }: { currentlyFollowing: boolean }) => {
  const mutation = useToggleFollow(username);
  return (
    <button onClick={() => mutation.mutate({ currentlyFollowing })}>toggle</button>
  );
};

const baseProfile: PublicUserProfileResponse = {
  id: "11111111-1111-4111-8111-111111111111",
  username,
  displayName: "Alice",
  bio: null,
  avatarUrl: null,
  isFollowing: false,
  followers: 10,
  following: 2,
};

describe("useToggleFollow", () => {
  it("follow success sets isFollowing true and increments followers", async () => {
    followUserMock.mockResolvedValue(undefined);
    const { queryClient } = renderWithQuery(
      <ToggleFollowTest currentlyFollowing={false} />,
    );

    queryClient.setQueryData(profileKeys.byUsername(username), baseProfile);

    await userEvent.click(screen.getByText("toggle"));

    await waitFor(() => {
      const next = queryClient.getQueryData<PublicUserProfileResponse>(
        profileKeys.byUsername(username),
      );
      expect(next?.isFollowing).toBe(true);
      expect(next?.followers).toBe(11);
    });
  });

  it("unfollow success sets isFollowing false and decrements followers", async () => {
    unfollowUserMock.mockResolvedValue(undefined);
    const { queryClient } = renderWithQuery(
      <ToggleFollowTest currentlyFollowing={true} />,
    );

    queryClient.setQueryData(profileKeys.byUsername(username), {
      ...baseProfile,
      isFollowing: true,
      followers: 10,
    } satisfies PublicUserProfileResponse);

    await userEvent.click(screen.getByText("toggle"));

    await waitFor(() => {
      const next = queryClient.getQueryData<PublicUserProfileResponse>(
        profileKeys.byUsername(username),
      );
      expect(next?.isFollowing).toBe(false);
      expect(next?.followers).toBe(9);
    });
  });

  it("error rolls back optimistic change", async () => {
    followUserMock.mockRejectedValue(new Error("boom"));
    const { queryClient } = renderWithQuery(
      <ToggleFollowTest currentlyFollowing={false} />,
    );

    queryClient.setQueryData(profileKeys.byUsername(username), baseProfile);

    await userEvent.click(screen.getByText("toggle"));

    await waitFor(() => {
      const next = queryClient.getQueryData<PublicUserProfileResponse>(
        profileKeys.byUsername(username),
      );
      expect(next?.isFollowing).toBe(false);
      expect(next?.followers).toBe(10);
    });
  });
});
