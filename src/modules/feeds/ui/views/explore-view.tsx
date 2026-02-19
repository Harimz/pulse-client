import React from "react";
import { ExploreFeedSection } from "../sections/explore-feed-section";
import { ComposePost } from "@/modules/posts/ui/components/compose-post";
import { useMe } from "@/modules/auth/api/auth.queries";

export const ExploreView = () => {
  const { data } = useMe();

  return (
    <div>
      {data && <ComposePost user={data} />}

      <ExploreFeedSection />
    </div>
  );
};
