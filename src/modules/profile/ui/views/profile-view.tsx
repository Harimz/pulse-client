import { useMe } from "@/modules/auth/api/auth.queries";
import { ProfileInfoSection } from "../sections/profile-info-section";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  useProfilePosts,
  usePublicUserProfile,
} from "../../api/profile.queries";
import { ProfilePostsSection } from "../sections/profile-posts-section";
import { useToggleFollow } from "@/modules/follows/api/follows.mutations";

export const ProfileView = ({ username }: { username: string }) => {
  const { data: myProfile } = useMe();
  const { data: publicProfile, isPending } = usePublicUserProfile(username);
  const { data: profilePosts } = useProfilePosts(username);
  const toggleFollow = useToggleFollow(username);

  const isSelf = myProfile?.username === publicProfile?.username;

  if (isPending) {
    return "loading...";
  }

  return (
    <div>
      <div className="flex items-center gap-4 py-6">
        <Link to={"/home"}>
          <ArrowLeft className="hover:text-muted-foreground" />
        </Link>
        <p className="font-bold">{publicProfile?.displayName}</p>
      </div>

      <ProfileInfoSection
        publicProfile={publicProfile}
        isSelf={isSelf}
        isTogglingFollow={toggleFollow.isPending}
        onToggleFollow={() => {
          if (!publicProfile || isSelf) return;
          toggleFollow.mutate({
            currentlyFollowing: publicProfile.isFollowing,
          });
        }}
      />

      <ProfilePostsSection posts={profilePosts} />
    </div>
  );
};
