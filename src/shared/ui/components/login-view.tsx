import React from "react";
import { LoginImage } from "../svgs/login-image";
import { Bell, Feather, MessageCircle, Users } from "lucide-react";
import { useAuthModal } from "@/modules/auth/ui/hooks/use-auth-modal";
import { Button } from "@/components/ui/button";

export const LoginView = () => {
  const { openLogin, openRegister } = useAuthModal();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-100 w-[95%] items-center justify-center flex flex-col">
        <LoginImage className="aspect-3/4 h-100 md:h-150" />

        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-custom-primary flex items-center justify-center">
            <Feather className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Pulse
          </span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          See what's happening
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          Sign in to view your personalized feed, follow people you love, and
          never miss a notification.
        </p>

        <div className="flex items-center justify-center gap-6 mb-8 text-muted-foreground">
          <div className="flex flex-col items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-custom-primary/70" />
            <span className="text-xs">Feeds</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Users className="h-4 w-4 text-custom-primary/70" />
            <span className="text-xs">Follows</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Bell className="h-4 w-4 text-custom-primary/70" />
            <span className="text-xs">Notifications</span>
          </div>
        </div>

        <div className="space-y-3 w-full mb-20">
          <Button variant="primary" className="w-full" onClick={openLogin}>
            Sign In
          </Button>

          <Button variant="outline" className="w-full" onClick={openRegister}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};
