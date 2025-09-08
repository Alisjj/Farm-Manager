import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// Disable rule that causes many warnings for apostrophes in JSX text nodes.
// This is a pragmatic choice for the demo app; consider fixing strings later.
eslintConfig.push({
  rules: {
    "react/no-unescaped-entities": "off",
  },
});

export default eslintConfig;
