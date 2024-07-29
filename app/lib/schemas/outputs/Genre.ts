import { z } from "zod";
import { MovieSchema } from "./Movie";

export const GenreSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const GenreWithMovies = GenreSchema.extend({
  movies: z.lazy(() => MovieSchema).optional(),
});

export const GetAllGenresSchema = z.array(
  GenreWithMovies.pick({
    id: true,
    title: true,
  })
);

export type GetAllGenresSchema = z.infer<typeof GetAllGenresSchema>;

export const GetGenreStatsSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    totalMovies: z.number(),
  })
  .nullable();

export type GetGenreStatsSchema = z.infer<typeof GetGenreStatsSchema>;
