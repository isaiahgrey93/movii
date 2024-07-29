import "./tailwind.css";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { CLIENT_ENV } from "@movii/config/client-env";
import { TrpcProvider } from "./lib/trpc/client";

export const loader = async () => {
  return json({
    ENV: CLIENT_ENV,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

  const env = JSON.stringify(data?.ENV);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${env}`,
          }}
        />
        <TrpcProvider>{children}</TrpcProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
