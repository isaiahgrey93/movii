import { GetMovieDetailsInputSchema } from "@movii/lib/schemas/inputs";
import { trpc } from "@movii/lib/trpc/client";
import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Image } from "remix-image";
import FallbackMoviePoster from "@movii/components/FallbackMoviePoster";
import { ArrowLeft, CalendarIcon, ClockIcon, StarIcon } from "lucide-react";
import { MovieSchema } from "@movii/lib/schemas/outputs";
import { Button } from "@movii/components/ui";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: data?.summary },
    { property: "og:image", content: data?.posterUrl },
  ];
};

export const loader = async (request: LoaderFunctionArgs) => {
  const args = GetMovieDetailsInputSchema.safeParse({
    id: request.params.movie,
  });

  if (!args.success) {
    return redirect("/");
  }

  const movie = await trpc.server().movies.getMovieById.query(args.data);

  if (!movie) {
    return redirect("/");
  }

  return json(movie);
};

function BackToMoviesLink() {
  const navigate = useNavigate();

  return (
    <Button
      variant={"link"}
      className="flex gap-2 items-center"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft />
      Back To Movies
    </Button>
  );
}

function MoviePoster({
  posterUrl,
  title,
}: {
  posterUrl?: string | null;
  title: string;
}) {
  if (posterUrl) {
    return (
      <Image
        width={320}
        height={450}
        src={posterUrl}
        alt={title}
        responsive={[{ maxWidth: 1200, size: { width: 320 } }]}
        className="rounded-lg shadow-lg"
      />
    );
  }
  return (
    <div className="shadow-lg">
      <div className="rounded-lg overflow-hidden">
        <FallbackMoviePoster value={title} width={320} height={450} />
      </div>
    </div>
  );
}

function MovieMetadata({ movie }: { movie: MovieSchema }) {
  return (
    <div className="flex items-center gap-4 pb-4">
      {movie.rating && (
        <span className="px-2 py-1 bg-gray-200 rounded-full text-sm font-semibold">
          {movie.rating}
        </span>
      )}
      {movie.ratingValue !== null ? (
        <div className="flex items-center">
          <StarIcon className="w-5 h-5 text-yellow-400 pr-1" />
          <span>{movie.ratingValue}/10</span>
        </div>
      ) : null}
      {movie.datePublished ? (
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 pr-1" />
          <span>{new Date(movie.datePublished).getFullYear()}</span>
        </div>
      ) : null}
      {movie.duration ? (
        <div className="flex items-center">
          <ClockIcon className="w-5 h-5 pr-1" />
          <span>{movie.duration.replace("PT", "").toLowerCase()}</span>
        </div>
      ) : null}
    </div>
  );
}

function MovieInfo({
  title,
  content,
  isGenre = false,
}: {
  title: string;
  content: string[] | { id: string; title: string }[];
  isGenre?: boolean;
}) {
  return (
    <div className="pb-4">
      <h2 className="text-xl font-semibold pb-2">{title}</h2>
      {isGenre ? (
        <div className="flex flex-wrap gap-2">
          {(content as { id: string; title: string }[]).map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {genre.title}
            </span>
          ))}
        </div>
      ) : (
        <p>{(content as string[]).join(", ")}</p>
      )}
    </div>
  );
}

export default function MovieDetails() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="font-sans min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <BackToMoviesLink />
        <div className="flex items-center flex-col md:flex-row gap-8 p-8 shadow-lg rounded-lg">
          <MoviePoster posterUrl={data.posterUrl} title={data.title} />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold pb-2">{data.title}</h1>
            <MovieMetadata movie={data} />
            <p className="pb-4">{data.summary}</p>
            <MovieInfo title="Genres" content={data.genres ?? []} isGenre />
            <MovieInfo title="Director" content={data.directors ?? []} />
            <MovieInfo title="Writers" content={data.writers ?? []} />
            <MovieInfo title="Main Cast" content={data.mainActors ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
