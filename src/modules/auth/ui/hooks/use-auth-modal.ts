import { useQueryState, parseAsStringEnum } from "nuqs";

const AUTH_MODES = ["login", "register"] as const;

const authParser = parseAsStringEnum([...AUTH_MODES]);

export const useAuthModal = () => {
  const [mode, setMode] = useQueryState("auth", authParser);

  const openLogin = () => setMode("login");
  const openRegister = () => setMode("register");
  const close = () => setMode(null);

  return {
    isOpen: mode !== null,
    mode,
    openLogin,
    openRegister,
    close,
    setMode,
  };
};
