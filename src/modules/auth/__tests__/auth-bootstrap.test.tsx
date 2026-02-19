import { describe, expect, it } from "vitest";
import { useAuthStore } from "../state/auth.store";
import { renderWithQuery } from "@/shared/test/utils/render";
import { AuthBootstrap } from "../ui/components/auth-bootstrap";
import { waitFor } from "@testing-library/dom";

describe("AuthBootstrap", () => {
  it("sets accessToken when refresh succeeds", async () => {
    useAuthStore.setState({ accessToken: null, status: "idle" });

    await fetch("http://localhost:8080/api/v1/auth/login", { method: "POST" });

    renderWithQuery(<AuthBootstrap />);

    await waitFor(() => {
      expect(useAuthStore.getState().status).toBe("ready");
      expect(useAuthStore.getState().accessToken).toBe(
        "access-token-refreshed",
      );
    });
  });

  //   it("clears accessToken when refresh fails", async () => {
  //     useAuthStore.setState({ accessToken: "old", status: "idle" });

  //     renderWithQuery(<AuthBootstrap />);

  //     await waitFor(() => {
  //       expect(useAuthStore.getState().accessToken).toBe(null);
  //     });
  //   });
});
