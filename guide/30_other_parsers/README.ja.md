# Other parsers

もしかしたら、あなたのチームでは TypeScript のようなトランスパイラを利用しているかもしれません。
このような場合、作成した ESLint ルールは同じトランスパイラでテストされるべきです。

## 別のパーサーを追加する

この章を通して、 TypeScript / React JSX を扱えるようになりましょう。

```tsx
type Props = {
  onClick: () => void;
};
const MyComponent = ({ onClick }: Props) => <button onClick={() => onClick()} />;
```

そして、`<button />` という React コンポーネントを禁止したいと思っている、とします。

まずはこれに対応する AST の構造を知るところからです。
覚えていますか？
そうです、私達には https://astexplorer.net があります。

TypeScript/JSX のパースを有効化するため、パーサー種別を "@typescript-eslint/parser" へ切り替えてください。

![switch_parser](./switch_parser.png)

ちなみに、ESLint はデフォルトでは espree というパーサーを使います。

`<button />` を見つけるクエリがわかりましたか？
はい、 `JSXIdentifier[name='button']` ですね。

ですので、今回のルールは次のような実装となります:

```ts
/* src/rules/no-jsx-button.ts */

import { Rule } from "eslint";
import { Node } from "estree";

const rule: Rule.RuleModule = {
  create: context => {
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

## rule tester を設定する

上記のルールをテストするため、このプロジェクトにパーサーを追加します。

```sh
$ npm i @typescript-eslint/parser --dev
```

そして、ESLint の RuleTester にパーサー設定をおこないます。

```ts
/* src/rules/no-jsx-button.test.ts */

import { RuleTester } from "eslint";

import rule from "./no-jsx-button";

// Specify parser
const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

tester.run("no-jsx-button", rule, {
  valid: [
    {
      code: `(props: props) => <div />`,
    },
  ],
  invalid: [
    {
      code: `(props: props) => <button />`,
      errors: [{ message: "Don't use <button>" }],
    },
  ],
});
```

どのような `parserOptions` が利用できるかは、各パーサーが決定します。
たとえば、`@typescript-eslint/parser` の設定可能な値は [@typescript-eslint/parser configuration](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration) に列挙されています。
また、 `parser` / `parserOptions` はチームのプロジェクトの .eslintrc ファイルにも存在しているはずです。

もしも RuleTester のパーサー設定を忘れてしまった場合、 `npm test` にて次のようなパースエラーが出力されてしまいます。

```text
Message:
  Should have no errors but had 1: [ { ruleId: null,
    fatal: true,
    severity: 2,
    message: "Parsing error: '>' expected.",
    line: 1,
    column: 23 } ]
```

## Summary

- プロジェクトが利用しているのと同じパーサーを使ってルールをテストしましょう

[Previous](../20_dive_into_ast/README.ja.md)
