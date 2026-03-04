import { ExploreFeedSection } from "../sections/explore-feed-section";
import { ComposePost } from "@/modules/posts/ui/components/compose-post";
import { useMe } from "@/modules/auth/api/auth.queries";

export const ExploreView = () => {
  const { data } = useMe();

  if (!data) {
    return "Please sign in";
  }

  return (
    <div>
      {data && <ComposePost user={data} />}

      <ExploreFeedSection />
    </div>
  );
};
