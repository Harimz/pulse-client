import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthModal } from "../hooks/use-auth-modal";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "./register-form";
import { LoginForm } from "./login-form";

export const AuthDialog = () => {
  const { isOpen, mode, close, openLogin, openRegister } = useAuthModal();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? openLogin() : close())}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "register" ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription>
            {mode === "register"
              ? "Join Pulse to post, follow, and build your feed."
              : "Sign in to continue."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {mode === "register" ? <RegisterForm /> : <LoginForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
