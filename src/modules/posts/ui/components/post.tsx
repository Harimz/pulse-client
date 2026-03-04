import type { PostResponse } from "../../domain/posts.schemas";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
import { useToggleLikePost } from "../../api/posts.mutations";
import { cn } from "@/lib/utils";

export const Post = ({ post }: { post: PostResponse }) => {
  const navigate = useNavigate();
  const toggleLike = useToggleLikePost();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate({ to: "/post/$id", params: { id: post.id } })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          navigate({ to: "/post/$id", params: { id: post.id } });
        }
      }}
      className="flex gap-4 border-b py-4 hover:bg-muted px-6 cursor-pointer"
    >
      <Link
        to="/profile/$username"
        params={{ username: post.author.username }}
        onClick={(e) => e.stopPropagation()}
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

      <div className="flex-1">
        <div className="flex gap-2 items-center">
          <Link
            to="/profile/$username"
            params={{ username: post.author.username }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-bold hover:underline cursor-pointer">
              {post.author.displayName}
            </h1>
          </Link>

          <p className="text-muted-foreground text-sm mt-0.5">
            @{post.author.username}
          </p>
        </div>

        <p className="whitespace-pre-wrap break-words">{post.body}</p>

        <div className="mt-4 flex gap-6">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle className="size-4" />
            {post.commentCount}
          </div>

          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              toggleLike.mutate({
                postId: post.id,
                nextLiked: !post.likedByMe,
              });
            }}
          >
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart
                className={cn(
                  "size-4",
                  post.likedByMe && "fill-red-500  text-red-500",
                )}
              />
              {post.likesCount}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
