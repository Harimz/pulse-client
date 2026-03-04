import type { CursorPageResponse } from "@/modules/feeds/domain/feed.schemas";
import { Post } from "@/modules/posts/ui/components/post";
import React from "react";

interface Props {
  posts: CursorPageResponse | undefined;
}

export const ProfilePostsSection = ({ posts }: Props) => {
  return (
    <div className="mt-4">
      <div className="border-b pb-4 px-6">
        <h1 className="text-muted-foreground">Posts</h1>
      </div>

      {posts?.items.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
