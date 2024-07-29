import { z } from "zod";
import { GenreSchema } from "./Genre";

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string(),
  posterUrl: z.string().optional(),
  rating: z.string().optional(),
  datePublished: z.string().optional(),
  directors: z.array(z.string()).optional(),
  duration: z.string().optional(),
  mainActors: z.array(z.string()).optional(),
  summary: z.string().optional(),
  bestRating: z.number().nullable(),
  ratingValue: z.number().nullable(),
  worstRating: z.number().nullable(),
  writers: z.array(z.string()).optional(),
});

export type MovieSchema = z.infer<typeof MovieSchema>;

export const GetMovieDetailsSchema = MovieSchema.extend({
  genres: z.array(z.lazy(() => GenreSchema).optional()),
}).nullable();

export type GetMovieDetailsSchema = z.infer<typeof GetMovieDetailsSchema>;

export const GetAllMoviesSchema = z.array(
  MovieSchema.pick({
    id: true,
    title: true,
    posterUrl: true,
    rating: true,
  })
);

export const GetAllMoviesWithPaginationSchema = z.object({
  data: GetAllMoviesSchema,
  pages: z.number(),
});

export type GetAllMoviesWithPaginationSchema = z.infer<
  typeof GetAllMoviesWithPaginationSchema
>;

export type GetAllMoviesSchema = z.infer<typeof GetAllMoviesSchema>;

export const GetAllMovieTitlesSchema = z.array(
  MovieSchema.pick({
    id: true,
    title: true,
  })
);

export type GetAllMovieTitlesSchema = z.infer<typeof GetAllMovieTitlesSchema>;
