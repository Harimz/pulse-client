import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { CommentResponse } from "../../domain/posts.schemas";

const FALLBACK_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export const CommentItem = ({ comment }: { comment: CommentResponse }) => {
  return (
    <div className="flex gap-4 border-b px-6 py-4">
      <Avatar>
        <AvatarImage src={comment.author.avatarUrl ?? FALLBACK_AVATAR} />
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">@{comment.author.username}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>

        <p className="mt-1 whitespace-pre-wrap break-words">{comment.body}</p>
      </div>
    </div>
  );
};
