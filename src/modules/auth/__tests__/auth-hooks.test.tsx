import { describe, expect, it } from "vitest";
import { useLogin, useLogout } from "../api/auth.mutations";
import { useAuthStore } from "../state/auth.store";
import { renderWithQuery } from "@/shared/test/utils/render";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

const TestLoginAndMe = () => {
  const login = useLogin();

  return (
    <div>
      <button
        onClick={() =>
          login.mutate({ email: "a@a.com", password: "pw" } as any)
        }
      >
        login
      </button>

      <div data-testid="token">{useAuthStore((s) => s.accessToken) ?? ""}</div>
    </div>
  );
};

const TestLogoutUI = () => {
  const logout = useLogout();
  const token = useAuthStore((s) => s.accessToken);

  return (
    <div>
      <div data-testid="token">{token ?? ""}</div>
      <button onClick={() => logout.mutate()}>logout</button>
    </div>
  );
};

describe("Auth hooks", () => {
  it("login stores token", async () => {
    useAuthStore.setState({ accessToken: null, status: "ready" });

    renderWithQuery(<TestLoginAndMe />);

    await userEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("access-token-1");
    });
  });

  it("logout clears token", async () => {
    useAuthStore.setState({ accessToken: "access-token-1", status: "ready" });

    renderWithQuery(<TestLogoutUI />);

    await userEvent.click(screen.getByText("logout"));

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("");
    });
  });
});
