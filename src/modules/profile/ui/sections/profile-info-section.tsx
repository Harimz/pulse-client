import { Button } from "@/components/ui/button";
import type { PublicUserProfileResponse } from "../../domain/profile.schemas";

interface Props {
  publicProfile: PublicUserProfileResponse | undefined;
  isSelf: boolean;
  onToggleFollow: () => void;
  isTogglingFollow: boolean;
}

export const ProfileInfoSection = ({
  publicProfile,
  isSelf,
  onToggleFollow,
  isTogglingFollow,
}: Props) => {
  return (
    <div className="border-b border-border">
      <div className="h-32 bg-custom-primary from-custom-primary/20 to-custom-primary/5" />

      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-10 mb-3">
          <img
            src={
              publicProfile?.avatarUrl ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={publicProfile?.displayName || "Profile Avatar"}
            className="h-20 w-20 rounded-full border-4 border-card bg-muted"
          />
          {isSelf ? (
            <Button variant="outline">Edit</Button>
          ) : (
            <Button
              variant={publicProfile?.isFollowing ? "outline" : "primary"}
              onClick={onToggleFollow}
              disabled={isTogglingFollow}
            >
              {publicProfile?.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {publicProfile?.displayName}
        </h2>
        <p className="text-sm text-muted-foreground">
          @{publicProfile?.username}
        </p>
        <p className="text-sm text-foreground mt-2 leading-relaxed">
          {publicProfile?.bio}
        </p>

        <div className="flex gap-4 mt-3">
          <span className="text-sm">
            <strong className="text-foreground">
              {publicProfile?.following}
            </strong>{" "}
            <span className="text-muted-foreground">Following</span>
          </span>
          <span className="text-sm">
            <strong className="text-foreground">
              {publicProfile?.followers}
            </strong>{" "}
            <span className="text-muted-foreground">Followers</span>
          </span>
        </div>
      </div>
    </div>
  );
};
