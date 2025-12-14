import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore backend JavaScript files
  {
    ignores: ["src/**/*.js", "tests/**/*.js", "addAdmin.js", "testApp.js"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// Relax some rules for pragmatic development
eslintConfig.push({
  rules: {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],
    "react-hooks/exhaustive-deps": "warn",
  },
});

export default eslintConfig;
