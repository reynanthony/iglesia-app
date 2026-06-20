import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Catch raw <img> tags — use next/image instead
      "@next/next/no-img-element": "warn",
      // Warn on console.log left in production code (console.error is allowed)
      "no-console": ["warn", { allow: ["error", "warn"] }],
      // Exhaustive deps for hooks
      "react-hooks/exhaustive-deps": "warn",
      // Catch @ts-ignore that hide real errors
      "@typescript-eslint/ban-ts-comment": ["warn", { minimumDescriptionLength: 10 }],
    },
  },
]);

export default eslintConfig;
