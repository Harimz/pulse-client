import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileInfoSection } from "../ui/sections/profile-info-section";
import type { PublicUserProfileResponse } from "../domain/profile.schemas";

const baseProfile: PublicUserProfileResponse = {
  id: "11111111-1111-4111-8111-111111111111",
  username: "alice",
  displayName: "Alice",
  bio: null,
  avatarUrl: null,
  isFollowing: false,
  followers: 10,
  following: 2,
};

describe("ProfileInfoSection CTA", () => {
  it("shows Edit for self profile", () => {
    render(
      <ProfileInfoSection
        publicProfile={baseProfile}
        isSelf={true}
        isTogglingFollow={false}
        onToggleFollow={vi.fn()}
      />,
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("shows Follow for non-self when not following", () => {
    render(
      <ProfileInfoSection
        publicProfile={{ ...baseProfile, isFollowing: false }}
        isSelf={false}
        isTogglingFollow={false}
        onToggleFollow={vi.fn()}
      />,
    );

    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  it("shows Unfollow for non-self when following", () => {
    render(
      <ProfileInfoSection
        publicProfile={{ ...baseProfile, isFollowing: true }}
        isSelf={false}
        isTogglingFollow={false}
        onToggleFollow={vi.fn()}
      />,
    );

    expect(screen.getByText("Unfollow")).toBeInTheDocument();
  });
});
