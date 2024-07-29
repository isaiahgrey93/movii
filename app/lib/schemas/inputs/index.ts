import { z } from "zod";

export const GetAllMoviesInputSchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1),
  limit: z.coerce.number().step(5).min(10).max(25).catch(10),
  search: z.string().optional(),
  genre: z.string().optional(),
});

export type GetAllMoviesInputSchema = z.infer<typeof GetAllMoviesInputSchema>;

export const GetAllMovieTitlesInputSchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1),
  limit: z.coerce.number().step(5).min(10).max(25).catch(10),
});

export type GetAllMovieTitlesInputSchema = z.infer<
  typeof GetAllMovieTitlesInputSchema
>;

export const GetMovieDetailsInputSchema = z.object({
  id: z.string(),
});

export type GetMovieDetailsInputSchema = z.infer<
  typeof GetMovieDetailsInputSchema
>;

export const GetAllGenresInputSchema = z.object({
  page: z.coerce.number().min(1).default(1).catch(1),
  limit: z.coerce.number().step(5).min(10).max(25).catch(10),
});

export type GetAllGenresInputSchema = z.infer<typeof GetAllGenresInputSchema>;

export const GetGenreStatsInputSchema = z.object({
  id: z.string(),
});

export type GetGenreStatsInputSchema = z.infer<typeof GetGenreStatsInputSchema>;
