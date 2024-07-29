import { router } from "@movii/lib/trpc/trpc";
import { movieRouter } from "./movies";

export const appRouter = router({
  movies: movieRouter,
});

export type AppRouter = typeof appRouter;
