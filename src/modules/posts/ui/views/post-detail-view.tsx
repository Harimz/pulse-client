import { Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useToggleLikePost } from "../../api/posts.mutations";
import { usePostById, usePostComments } from "../../api/posts.queries";
import { CommentComposer } from "../components/comment-composer";
import { CommentItem } from "../components/comment-item";
import { feedKeys } from "@/modules/feeds/api/feeds.keys";

const FALLBACK_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export const PostDetailView = ({ postId }: { postId: string }) => {
  const qc = useQueryClient();
  const postQuery = usePostById(postId);
  const commentsQuery = usePostComments(postId, 20);
  const toggleLike = useToggleLikePost();

  if (postQuery.isPending) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (postQuery.isError || !postQuery.data) {
    return <div className="px-6 py-6">Failed to load post.</div>;
  }

  const post = postQuery.data;
  const comments = commentsQuery.data?.items ?? [];
  const feedSnapshots = qc.getQueriesData({ queryKey: feedKeys.all });

  const likedFromFeedCache = feedSnapshots
    .map(([, data]) => data)
    .find((data) => {
      const pages = (data as InfiniteData<{ items: Array<{ id: string }> }> | undefined)
        ?.pages;
      return pages?.some((page) => page.items.some((item) => item.id === post.id));
    });

  const likedFromFeedItem =
    (
      likedFromFeedCache as
        | InfiniteData<{ items: Array<{ id: string; likedByMe?: boolean }> }>
        | undefined
    )?.pages
      .flatMap((page) => page.items)
      .find((item) => item.id === post.id)?.likedByMe ?? undefined;

  const likedByMe = likedFromFeedItem ?? post.likedByMe ?? false;

  return (
    <div className="pb-8">
      <div className="flex items-center gap-4 px-6 py-6">
        <Link to="/home">
          <ArrowLeft className="hover:text-muted-foreground" />
        </Link>
        <p className="font-bold">Post</p>
      </div>

      <div className="flex gap-4 border-b px-6 py-4">
        <Link to="/profile/$username" params={{ username: post.author.username }}>
          <Avatar>
            <AvatarImage src={post.author.avatar ?? FALLBACK_AVATAR} />
          </Avatar>
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link to="/profile/$username" params={{ username: post.author.username }}>
              <h1 className="font-bold hover:underline">{post.author.displayName}</h1>
            </Link>
            <p className="text-sm text-muted-foreground">@{post.author.username}</p>
          </div>

          <p className="mt-2 whitespace-pre-wrap break-words">{post.body}</p>

          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="size-4" />
              {post.commentCount}
            </div>

            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() =>
                toggleLike.mutate({
                  postId: post.id,
                  nextLiked: !likedByMe,
                })
              }
            >
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart
                  className={cn(
                    "size-4",
                    likedByMe && "fill-red-500 text-red-500",
                  )}
                />
                {post.likesCount}
              </div>
            </Button>
          </div>
        </div>
      </div>

      <CommentComposer postId={post.id} />

      <div className="border-b px-6 py-4">
        <h2 className="text-muted-foreground">Comments</h2>
      </div>

      {commentsQuery.isPending && (
        <div className="flex items-center justify-center py-6">
          <Spinner className="size-5" />
        </div>
      )}

      {commentsQuery.isError && (
        <div className="px-6 py-4 text-sm text-muted-foreground">
          Failed to load comments.
        </div>
      )}

      {!commentsQuery.isPending && !commentsQuery.isError && comments.length === 0 && (
        <div className="px-6 py-4 text-sm text-muted-foreground">No comments yet.</div>
      )}

      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
