import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../state/auth.store";
import { useAuthModal } from "../ui/hooks/use-auth-modal";
import { login, logout, register } from "./auth.client";
import type { LoginRequest, RegisterRequest } from "../domain/auth.schemas";
import { authKeys } from "./auth.keys";
import { toast } from "sonner";
import { ApiError } from "@/shared/api/api-error";

export const useLogin = () => {
  const qc = useQueryClient();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  return useMutation({
    mutationFn: (input: LoginRequest) => login(input),
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);

      await qc.invalidateQueries({ queryKey: authKeys.me() });
    },

    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Something went wrong");
    },
  });
};

export const useRegister = () => {
  const qc = useQueryClient();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const { close, openLogin } = useAuthModal();

  return useMutation({
    mutationFn: (input: RegisterRequest) => register(input),

    onSuccess: async (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        await qc.invalidateQueries({ queryKey: authKeys.me() });
        close();
        toast.success("Account created!");
        return;
      }

      toast.success("Account created! Please log in.");
      openLogin();
    },

    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Something went wrong");
    },
  });
};

export const useLogout = () => {
  const qc = useQueryClient();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  return useMutation({
    mutationFn: () => logout(),

    onSuccess: async () => {
      setAccessToken(null);

      await qc.invalidateQueries({ queryKey: authKeys.me() });

      toast.success("Logged out");
    },

    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error("Something went wrong");
    },
  });
};
