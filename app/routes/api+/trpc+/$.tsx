import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { appRouter } from "@movii/lib/trpc/routers";
import { createContext } from "@movii/lib/trpc/trpc";

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext,
  });

export const loader = async (args: LoaderFunctionArgs) => handler(args.request);
export const action = async (args: ActionFunctionArgs) => handler(args.request);
