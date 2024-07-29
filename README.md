# Welcome to Movii!

[https://movii.onrender.com](https://movii.onrender.com)

## Movii - Movie Search Application

## Highlight something in your project that you thought was especially

interesting or significant to your overall implementation.

One of the most interesting aspects of this project is the implementation of a robust query parameter handling system. The loader function uses `parseWithZod` from `@conform/react` to validate and sanitize input, ensuring that only valid query parameters are processed. This approach significantly enhances the application's reliability and security.

The system also includes intelligent fallback mechanisms:

- It redirects to the home page if the submission is invalid.
- It adjusts query parameters if they don't match valid options (e.g., removing an invalid genre).
- It corrects the page number if it exceeds the available pages.

## Tell us what you are most pleased or proud of with your implementation.

How I've setup data fetching/validation with TRPC and Zod. I feel it gives a very clean API across the stack and provides consistent fetcher validation with the Zod integration.

## Given more time, what next feature or improvement would you like to add

to your project?

I'd take error handling setup with TRPC further and add a more robust error handling setup and definitions to better pass errors back to the client with relevant information.
Another piece would be extract my parameter validation logic that clean the parameters and adjusted them for users if the were incorrect/invalid and make it into something more generic to be reused.

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
