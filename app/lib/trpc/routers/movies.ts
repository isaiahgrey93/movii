import { procedure, router } from "@movii/lib/trpc/trpc";

import * as movies from "@movii/lib/fetchers/movies";

import {
  GetAllGenresInputSchema,
  GetAllMoviesInputSchema,
  GetAllMovieTitlesInputSchema,
  GetGenreStatsInputSchema,
  GetMovieDetailsInputSchema,
} from "@movii/lib/schemas/inputs";

import {
  GetAllMovieTitlesSchema,
  GetAllMoviesWithPaginationSchema,
  GetMovieDetailsSchema,
} from "@movii/lib/schemas/outputs";
import { TRPCError } from "@trpc/server";
import {
  GetAllGenresSchema,
  GetGenreStatsSchema,
} from "@movii/lib/schemas/outputs/Genre";

export const movieRouter = router({
  getAllMovies: procedure
    .input(GetAllMoviesInputSchema)
    .output(GetAllMoviesWithPaginationSchema)
    .query(async ({ input }) => {
      const { error, data } = await movies.getMovies(input);

      if (error) {
        throw new TRPCError({ message: error, code: "BAD_REQUEST" });
      }

      return data;
    }),
  getAllMovieTitles: procedure
    .input(GetAllMovieTitlesInputSchema)
    .output(GetAllMovieTitlesSchema)
    .query(async ({ input }) => {
      const { error, data } = await movies.getMovieTitles(input);

      if (error) {
        throw new TRPCError({ message: error, code: "BAD_REQUEST" });
      }

      return data;
    }),
  getMovieById: procedure
    .input(GetMovieDetailsInputSchema)
    .output(GetMovieDetailsSchema)
    .query(async ({ input }) => {
      const { error, data } = await movies.getMovieById(input);

      if (error) {
        throw new TRPCError({ message: error, code: "BAD_REQUEST" });
      }

      return data;
    }),
  getAllGenres: procedure
    .input(GetAllGenresInputSchema)
    .output(GetAllGenresSchema)
    .query(async ({ input }) => {
      const { error, data } = await movies.getMovieGenres(input);

      if (error) {
        throw new TRPCError({ message: error, code: "BAD_REQUEST" });
      }

      return data;
    }),
  getGenreStats: procedure
    .input(GetGenreStatsInputSchema)
    .output(GetGenreStatsSchema)
    .query(async ({ input }) => {
      const { error, data } = await movies.getMovieGenreStats(input);

      if (error) {
        throw new TRPCError({ message: error, code: "BAD_REQUEST" });
      }

      return data;
    }),
});
