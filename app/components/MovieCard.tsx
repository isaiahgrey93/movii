import { Link } from "@remix-run/react";
import { Image } from "remix-image";
import FallbackMoviePoster from "./FallbackMoviePoster";

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl?: string | null;
  rating?: string | null;
}

export function MovieCard({ id, title, posterUrl, rating }: MovieCardProps) {
  return (
    <Link to={`/movies/${id}`} className="flex justify-center">
      <div className="flex justify-between items-center overflow-hidden flex-col shadow border rounded-md relative w-full max-w-52 sm:max-w-64 hover:shadow-xl">
        {posterUrl ? (
          <Image
            width={250}
            height={360}
            src={posterUrl}
            alt={title}
            responsive={[{ maxWidth: 1200, size: { width: 250 } }]}
            className="object-center w-full overflow-hidden"
          />
        ) : (
          <FallbackMoviePoster value={title} width={250} height={360} />
        )}
        {rating ? (
          <div className="absolute top-0 right-0 p-5">
            <div className="px-2 py-1 bg-white border rounded-2xl font-black">
              {rating}
            </div>
          </div>
        ) : null}
        <div className="flex-0 py-2 px-4 flex items-center font-semibold text-balance text-center">
          {title}
        </div>
      </div>
    </Link>
  );
}
