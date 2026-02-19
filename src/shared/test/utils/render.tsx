import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import type React from "react";

export const makeTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

export const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = makeTestQueryClient();

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{ui}</NuqsAdapter>
      </QueryClientProvider>,
    ),
  };
};
