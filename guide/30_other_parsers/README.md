# Other parsers
Your team may use some transpilers such as TypeScript to write project source codes.
In this case ESLint rules you create should be tested using the same transpiler.

## Add other parser
We'll get be able to treat TypeScript / React JSX  through this chapter.

```tsx
type Props = {
  onClick: () => void,
};
const MyComponent = ({ onClick }: Props) => (
  <button onClick={() => onClick()} />
);
```

So we assume that we want to ban to use `<button />` React component.

Let's get AST node for this.
Do you remember?
That's right, we have https://astexplorer.net

To turn on TypeScript/JSX parsing, switch the parser type to "@eslint-typescript/parser".

![switch_parser](./switch_parser.png)

FYI, ESLint uses esprima as default.

Do you get the query to find `<button />`?
Yes, it's `JSXIdentifier[name='button']`.

So our rule is implemented as the following:

```ts
/* src/rules/no-jsx-button.ts */

import { Rule } from "eslint";
import { Node } from "estree";

const rule: Rule.RuleModule = {
  create: (context) => {
    return {
      "JSXIdentifier[name='button']": (node: Node) => {
        context.report({
          message: "Don't use <button>",
          node,
        });
      },
    };
  },
};

export = rule;
```

## Configure rule tester
And we need to test the above rule so add parser to our project.

```sh
$ npm i @eslint-typescript/parser --dev
```

And tell parser configuration to ESLint RuleTester.

```ts
/* src/rules/no-jsx-button.test.ts */

import { RuleTester } from "eslint";

import rule from "./no-jsx-button";

// Specify parser
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
```

What value the `parserOptions` accepts is defined by each parser.
For example, `@eslint-typescript/parser`'s configurable values are listed up in https://github.com/eslint/typescript-eslint-parser .
The `parser` / `parserOptions` values also should exists your team project's `.eslintrc`.

If you forget to configure RuleTester's parser, `npm test` outputs parsing errors such as:

```text
Message:
  Should have no errors but had 1: [ { ruleId: null,
    fatal: true,
    severity: 2,
    message: 'Parsing error: Unexpected token :',
    line: 1,
    column: 7 } ]
```

## Summary

* Test rules with parser same to one the project uses

[Previous](../20_dive_into_ast/README.md)
