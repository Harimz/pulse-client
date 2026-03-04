import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMe } from "@/modules/auth/api/auth.queries";
import { useCreatePostComment } from "../../api/posts.mutations";

const FALLBACK_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export const CommentComposer = ({ postId }: { postId: string }) => {
  const [body, setBody] = useState("");
  const { data: me } = useMe();
  const createComment = useCreatePostComment(postId);

  const onSubmit = () => {
    if (!body.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    createComment.mutate(
      { body },
      {
        onSuccess: () => {
          setBody("");
        },
      },
    );
  };

  return (
    <div className="border-b px-6 py-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={me?.profile.avatarUrl ?? FALLBACK_AVATAR} />
        </Avatar>

        <div className="w-full">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
          />

          <div className="mt-3 flex justify-end">
            <Button
              onClick={onSubmit}
              variant="primary"
              disabled={createComment.isPending}
            >
              {createComment.isPending ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
