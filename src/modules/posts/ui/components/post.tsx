import type { PostResponse } from "../../domain/posts.schemas";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";

export const Post = ({ post }: { post: PostResponse }) => {
  return (
    <Link to="/post/$id" params={{ id: post.id }}>
      <div className="flex gap-4 border-b py-4 hover:bg-muted px-6 cursor-pointer">
        <Link
          to="/profile/$username"
          params={{ username: post.author.username }}
        >
          <Avatar>
            <AvatarImage
              src={
                post.author.avatar ??
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
            />
          </Avatar>
        </Link>

        <div>
          <Link
            to="/profile/$username"
            params={{ username: post.author.username }}
          >
            <h1 className="font-bold hover:underline cursor-pointer">
              {post.author.username}
            </h1>
          </Link>

          <p>{post.body}</p>

          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="size-4" />
              {post.commentCount}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="size-4" />
              {post.likesCount}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
