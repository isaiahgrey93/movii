import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [`${process.env.MOVIES_API_URL}/graphql`]: {
        headers: {
          Authorization: `Bearer ${process.env.MOVIES_AUTH_TOKEN}`,
        },
      },
    },
  ],
  generates: {
    "./app/types/generated.ts": {
      plugins: ["typescript"],
      config: {
        strictScalars: true,
        skipTypename: true,
      },
    },
  },
};

export default config;
