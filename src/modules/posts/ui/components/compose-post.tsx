import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MeResponse } from "@/modules/auth/domain/auth.schemas";
import { useState } from "react";
import { useCreatePost } from "../../api/posts.mutations";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const MAX_LENGTH = 500;

export const ComposePost = ({ user }: { user: MeResponse }) => {
  const [userInput, setUserInput] = useState("");
  const { mutate } = useCreatePost();

  const length = userInput.length;
  const remaining = MAX_LENGTH - length;

  const isOverLimit = length > MAX_LENGTH;
  const isTooShort = length === 0;

  const handleSubmit = () => {
    if (isTooShort) {
      toast.error("Post cannot be empty");
      return;
    }

    if (isOverLimit) {
      toast.error("Post exceeds 500 characters");
      return;
    }

    mutate(
      { body: userInput },
      {
        onSuccess: () => {
          setUserInput("");
        },
      },
    );
  };

  return (
    <div className="flex gap-4 pt-10 px-6">
      <Avatar>
        <AvatarImage
          src={
            user.profile.avatarUrl ??
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
        />
      </Avatar>

      <div className="w-full">
        <Textarea
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          placeholder="What's on your mind?"
        />

        <Separator />

        <div className="my-4 flex items-center justify-between">
          <p className="text-muted-foreground">{remaining}</p>

          <Button onClick={handleSubmit} variant="primary">
            Post
          </Button>
        </div>

        <Separator />
      </div>
    </div>
  );
};
