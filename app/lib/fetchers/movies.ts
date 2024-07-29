import { SERVER_ENV } from "@movii/config/server-env.server";
import axios from "axios";
import {
  GetAllGenresInputSchema,
  GetAllMoviesInputSchema,
  GetAllMovieTitlesInputSchema,
  GetGenreStatsInputSchema,
  GetMovieDetailsInputSchema,
} from "../schemas/inputs";
import {
  GetAllGenresSchema,
  GetAllMoviesSchema,
  GetAllMoviesWithPaginationSchema,
  GetAllMovieTitlesSchema,
  GetGenreStatsSchema,
  GetMovieDetailsSchema,
} from "../schemas/outputs";
import { LRUCache } from "lru-cache";

const cache = new LRUCache({ max: 500, ttl: 1000 * 60 * 60 });

const getCacheKey = (prefix: string) => (page: number, limit: number) =>
  `${prefix}-${page}-${limit}`;

const getMovieGenresCacheKey = getCacheKey("getMovieGenres");

const getCachedAndJsonParseSafely = (key: string) => {
  try {
    const cached = cache.get(key);
    if (typeof cached === "string") {
      return JSON.parse(cached);
    }
    return cached;
  } catch {
    return;
  }
};

const api = axios.create({
  baseURL: SERVER_ENV.MOVIES_API_URL,
  headers: {
    Authorization: `Bearer ${SERVER_ENV.MOVIES_AUTH_TOKEN}`,
  },
});

const endpoints = {
  get: {
    getAuthToken: "/auth/token",
    getHealthCheck: "/healthcheck",
    getMovieGenres: "/genres/movies",
    getMovies: "/movies",
    getMovieById: (id: string) => `/movies/${id}`,
    getMovieTitles: "/movies/titles",
    getMovieGenreStats: (id: string) => `/movies/genres/${id}`,
  },
};

interface ApiResponse<Data> {
  data: Data;
  error?: string;
}

export const getMovies = async ({
  page,
  limit,
  search,
  genre,
}: GetAllMoviesInputSchema): Promise<
  ApiResponse<GetAllMoviesWithPaginationSchema>
> => {
  try {
    const response = await api.get(endpoints.get.getMovies, {
      params: { page, limit, search, genre },
    });

    const data = GetAllMoviesSchema.parse(response.data.data);

    return { data: { data, pages: response.data.totalPages } };
  } catch (e) {
    return {
      data: { data: [], pages: 0 },
      error: "Unable to fetch list of all movies.",
    };
  }
};

export const getMovieTitles = async ({
  page,
  limit,
}: GetAllMovieTitlesInputSchema): Promise<
  ApiResponse<GetAllMovieTitlesSchema>
> => {
  try {
    const response = await api.get(endpoints.get.getMovieTitles, {
      params: { page, limit },
    });

    const data = GetAllMovieTitlesSchema.parse(response.data.data);

    return { data };
  } catch {
    return { data: [], error: "Unable to fetch list of all movie titles." };
  }
};

export const getMovieGenres = async (
  { page, limit }: GetAllGenresInputSchema,
  paged: GetAllGenresSchema = []
): Promise<ApiResponse<GetAllGenresSchema>> => {
  try {
    const key = getMovieGenresCacheKey(page, limit);
    const cached = getCachedAndJsonParseSafely(key);
    const result = cached && GetAllGenresSchema.safeParse(cached);

    let data: GetAllGenresSchema;

    if (!result || !result.success) {
      const response = await api.get(endpoints.get.getMovieGenres, {
        params: { page, limit },
      });

      data = GetAllGenresSchema.parse(response.data.data);

      cache.set(key, JSON.stringify(data));
    } else {
      data = result.data;
    }

    const genres = [...paged, ...data];

    if (data.length === limit) {
      // If we received a full page, there might be more data
      return getMovieGenres({ page: page + 1, limit }, genres);
    }

    return { data: genres };
  } catch (error) {
    return { data: [], error: "Unable to fetch list of all movie genres." };
  }
};

export const getMovieById = async ({
  id,
}: GetMovieDetailsInputSchema): Promise<ApiResponse<GetMovieDetailsSchema>> => {
  try {
    const response = await api.get(endpoints.get.getMovieById(id));

    const data = GetMovieDetailsSchema.parse(response.data);

    return { data };
  } catch (error) {
    return { data: null, error: "Unable to fetch movie details." };
  }
};

export const getMovieGenreStats = async ({
  id,
}: GetGenreStatsInputSchema): Promise<ApiResponse<GetGenreStatsSchema>> => {
  try {
    const response = await api.get(endpoints.get.getMovieGenreStats(id));

    const data = GetGenreStatsSchema.parse(response.data);

    return { data };
  } catch (error) {
    return { data: null, error: "Unable to fetch genre stats." };
  }
};
