import { parseWithZod } from "@conform-to/zod";
import { Pagination, MovieCard, ResultsSummary } from "@movii/components";
import { Button, Input, Label } from "@movii/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@movii/components/ui/select";
import { GetAllMoviesInputSchema } from "@movii/lib/schemas/inputs";
import { trpc } from "@movii/lib/trpc/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  redirect,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Loader, XIcon } from "lucide-react";
import { useCallback, useMemo } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Movii" },
    { name: "description", content: "Find movies to watch." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const caller = trpc.server();

  const search = new URL(request.url).searchParams;

  const submission = parseWithZod(search, {
    schema: GetAllMoviesInputSchema,
  });

  if (submission.status !== "success") {
    throw redirect("/");
  }

  // Check if query params are valid and if they are not, fallback to default values for invalid fields
  // and generate a new query string to redirect for a new query with valid query params
  let matches = true;

  const qs = new URLSearchParams();

  const keys = Object.keys(GetAllMoviesInputSchema.shape);

  search.forEach((value, key) => {
    // @ts-expect-error there is no overlap between the type string and the literal GetAllMoviesInputSchema keys
    const submitted = submission.value[key];

    const isValidKey = keys.includes(key);
    const isValidValue = !["", null, undefined].includes(submitted);

    if (!isValidKey) {
      matches = false;
    } else if (!isValidValue) {
      matches = false;
    } else if (isValidKey && isValidValue && submitted != value) {
      matches = false;

      qs.set(key, submitted);
    } else if (isValidKey && isValidValue) {
      qs.set(key, submitted);
    }
  });

  if (!matches) {
    qs.sort();

    return redirect(`?${qs.toString()}`);
  }

  try {
    // Get genres ahead of querying movies based on the genre field.
    const genres = await caller.movies.getAllGenres.query({});

    // The movies query endpoints doesn't take kindly to a genre that doesn't exist and throws a 400 Bad Request
    // Only search movies if the genre query param matches a valid genre value
    // Otherwise remove the genre query parameter
    const genre = genres.find(
      (genre) => genre.title === submission.value.genre
    );
    if (!submission.value.genre || (submission.value.genre && genre)) {
      const movies = await caller.movies.getAllMovies.query(submission.value);

      if (submission.value.page !== 1 && submission.value.page > movies.pages) {
        qs.set("page", Math.max(1, movies.pages).toString());

        return redirect(`?${qs.toString()}`);
      }

      return {
        movies,
        genres,
      };
    } else {
      qs.delete("genre");

      return redirect(`?${qs.toString()}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unexpected error occurred.");
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [params, setParams] = useSearchParams();

  const query = useMemo(
    () =>
      GetAllMoviesInputSchema.safeParse(Object.fromEntries(params.entries()))
        .data,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.toString()]
  );

  const onChangeQuery = useCallback(
    (key: string, genre: string) => {
      setParams((params) => {
        params.set(key, genre);

        return params;
      });
    },
    [setParams]
  );

  const id = params.toString();
  const pages = data.movies.pages;
  const page = Number(query?.page) ?? 1;

  return (
    <div className="font-sans p-4 min-h-screen">
      {isLoading ? (
        <div className="z-10 w-screen h-full fixed top-0 left-0 backdrop-blur-sm flex items-center justify-center bg-white/50">
          <div>
            <Loader className="animate-spin" size={40} />
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Search</Label>
            <div className="flex items-center">
              <Input
                key={id}
                name="search"
                defaultValue={query?.search}
                onBlur={(evt) => onChangeQuery("search", evt.target.value)}
                onKeyDown={(evt) => {
                  evt.key === "Enter" &&
                    onChangeQuery("search", evt.currentTarget.value);
                }}
                className={`${query?.search ? "rounded-r-none" : ""}`}
              />
              {query?.search ? (
                <Button
                  size="icon"
                  onClick={() => onChangeQuery("search", "")}
                  className={"rounded-l-none"}
                >
                  <XIcon />
                </Button>
              ) : null}
            </div>
          </div>
          <div className="flex-1">
            <Label>Genre</Label>
            <div className="flex items-center">
              <Select
                key={id}
                name="query"
                defaultValue={query?.genre}
                onValueChange={(value) => onChangeQuery("genre", value)}
              >
                <SelectTrigger
                  className={`w-full ${query?.genre ? "rounded-r-none" : ""}`}
                >
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  {data.genres.map((genre) =>
                    genre ? (
                      <SelectItem key={genre.id} value={genre.title}>
                        {genre.title}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
              {query?.genre ? (
                <Button
                  size="icon"
                  onClick={() => onChangeQuery("genre", "")}
                  className={"rounded-l-none"}
                >
                  <XIcon />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex gap-1">
            <ResultsSummary
              page={page}
              pages={pages}
              limit={query?.limit ?? 0}
              amount={data.movies.data.length}
            />
          </div>
          <div className="flex-col gap-4 items-center">
            <Select
              name="limit"
              defaultValue={query?.limit?.toString()}
              onValueChange={(value) => onChangeQuery("limit", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue defaultValue={10} placeholder="limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"10"}>10 Per Page</SelectItem>
                <SelectItem value={"15"}>15 Per Page</SelectItem>
                <SelectItem value={"20"}>20 Per Page</SelectItem>
                <SelectItem value={"25"}>25 Per Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 py-9">
        {data.movies.data.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            rating={movie.rating}
          />
        ))}
      </div>
      <Pagination
        totalPages={pages}
        currentPage={page}
        onPageChange={(page) => onChangeQuery("page", String(page))}
      />
    </div>
  );
}
