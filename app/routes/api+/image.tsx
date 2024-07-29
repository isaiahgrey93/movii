import { imageLoader, MemoryCache } from "remix-image/server";
import { sharpTransformer } from "remix-image-sharp";
import { LoaderFunction } from "@remix-run/node";
import { SERVER_ENV } from "@movii/config/server-env.server";

const config = {
  selfUrl: SERVER_ENV.APP_URL,
  cache: new MemoryCache(),
  transformer: sharpTransformer,
};

export const loader: LoaderFunction = ({ request }) => {
  return imageLoader(config, request);
};
