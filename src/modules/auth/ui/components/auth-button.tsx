import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRightToLine } from "lucide-react";
import type { MeResponse } from "../../domain/auth.schemas";
import { useAuthModal } from "../hooks/use-auth-modal";
import { useLogout } from "../../api/auth.mutations";

interface Props {
  user: MeResponse | undefined | null;
}

export const AuthButton = ({ user }: Props) => {
  const { openLogin } = useAuthModal();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  if (user) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <span className="truncate">{user.username}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <PopoverHeader>
            <PopoverTitle>@{user.username}</PopoverTitle>
            <PopoverDescription>{user.email ?? "Signed in"}</PopoverDescription>
          </PopoverHeader>

          <div className="mt-3">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button
      className="w-full gap-2 text-center"
      onClick={openLogin}
      variant="primary"
    >
      <ArrowRightToLine className="size-4" />
      Login
    </Button>
  );
};
