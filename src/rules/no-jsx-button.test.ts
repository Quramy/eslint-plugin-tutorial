import { RuleTester } from "eslint";

import rule from "./no-jsx-button";

const tester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsx: true,
  },
});

tester.run("no-jsx-button", rule, {
  valid: [
    {
      filename: "valid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <div />`,
    },
  ],
  invalid: [
    {
      filename: "invalid.tsx", // filename must be set to tell parser this code is tsx
      code: `(props: props) => <button />`,
      errors: [{ message: "Don't use <button>" }],
    }
  ],
});
