import { initTRPC } from "@trpc/server";
import { SuperJSON } from "superjson";
import { type inferAsyncReturnType } from "@trpc/server";

export async function createContext() {
  return {};
}
export type Context = inferAsyncReturnType<typeof createContext>;

export const { router, procedure } = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});
