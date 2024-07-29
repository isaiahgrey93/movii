import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "./routers";
import { SuperJSON } from "superjson";

const client = createTRPCReact<AppRouter>();

const server = () =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.APP_URL}/api/trpc`,
      }),
    ],
    transformer: SuperJSON,
  });

export const TrpcProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    client.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
      transformer: SuperJSON,
    })
  );

  return (
    <client.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </client.Provider>
  );
};

export const trpc = {
  server: server,
  client: client,
};
