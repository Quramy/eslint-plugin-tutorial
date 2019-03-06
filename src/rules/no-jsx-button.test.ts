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
      filename: "valid.tsx", // filename is should set to tell parser this code is TSX
      code: `(props: Props) => <div />`,
    },
  ],
  invalid: [
    {
      filename: "invalid.tsx", // filename is should set to tell parser this code is TSX
      code: `(props: Props) => <button />`,
      errors: [{ message: "Don't use <button>" }],
    }
  ],
});
