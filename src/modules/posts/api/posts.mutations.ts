import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/api/api-error";
import { createPost } from "./posts.client";
import { toast } from "sonner";
import { feedKeys } from "@/modules/feeds/api/feeds.keys";

export const useCreatePost = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: feedKeys.all });
      toast.success("Post created");
    },
    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Something went wrong");
    },
  });
};
