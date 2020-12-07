# Your first rule

本章では ESLint プラグインの作成方法を学びます。

## Create a rule module

まず`src/rules/no-literal.ts` という名前で新しいファイルを作成して以下のように編集してください。

```ts
import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  create: context => {
    return {
      Literal: node => {
        context.report({
          message: "😿",
          node,
        });
      },
    };
  },
};

export = rule;
```

おめでとうございます！はじめての ESLint ルールができました。

これは非常にバカバカしいルールです。何かしらのリテラル（例: `1`, `'hoge'`, ...）を見つけると泣いている猫の絵文字を出力するルールです。
しかし、このルールは様々なことを教えてくれます。

- ESLint ルールは `RuleModule` インターフェイスを実装する必要がある
  - ルールは `create` 関数をもち、この関数の引数は `context` である
- `create` 関数はオブジェクトを返却しなくてはならない
  - このオブジェクトのキーは私達の興味がある AST ノードの種類を表している（AST ノードタイプとキーの関係は後ほど学んでいきます :smile: ）
  - その値は関数であり、エラーメッセージがこの関数で出力される

## Test the rule

つづいて、このルールが動作することをテストしてみましょう。

`src/rules/no-literal.test.ts` という名前でファイルをもう 1 つ作成して編集しましょう:

```ts
import { RuleTester } from "eslint";

import rule from "./no-literal";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run("no-literal", rule, {
  valid: [{ code: `let x` }],
  invalid: [
    {
      code: `const x = 1;`,
      errors: [{ message: "😿" }],
    },
  ],
});
```

以下によりこのテストコードを走らせます:

```sh
$ npm test
```

次のようなコンソール出力が得られましたか？

```text
PASS src/rules/no-literal.test.ts
  no-literal
    valid
      ✓ let x (29ms)
    invalid
      ✓ const x = 1; (5ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.506s, estimated 2s
```

The test code tests 2 assertions:

このコードは 2 つのアサーションをおこなっています。

1. 正しいコードが与えられた場合、ルールが何もエラーを出力しない
1. 間違ったコードが与えられた場合、 ルールがエラーを出力する(:crying_cat_face:)

## Create plugin

それでは、ルールを ESLint プラグインとして配布する準備をしましょう。

プラグインはルールモジュールの名前を ESLint に伝えるための index ファイルを必要とします。

`src/index.ts` を作成して次のように編集してください:

```ts
import noLiteral from "./rules/no-literal";

export = {
  rules: {
    "no-literal": noLiteral,
  },
};
```

`npm publish` を実行する前に、初めてのプラグインが NPM プロジェクトの中で動作することを確認します。

次のコマンドを eslint-plugin-tutorial ディレクトリ以下で実行してください（`npm` の代わりに `yarn` を使ってもかまいません）。

```sh
$ npm link
```

これで、このパッケージを npm コマンドでインストールできます。

次に、プラグインを利用するサンプルプロジェクトを作成してください。

```sh
$ cd ..
$ mkdir example-prj
$ cd example-prj
$ npm init -f
$ npm i eslint --dev
```

サンプルプロジェクトへプラグインを追加します。

```sh
$ npm link @quramy/eslint-plugin-tutorial
```

最後に .eslintrc を作成してプラグインを利用するように設定してください。

```json
{
  "plugins": ["@quramy/tutorial"],
  "parserOptions": {
    "ecmaVersion": 2015
  },
  "rules": {
    "@quramy/tutorial/no-literal": 2
  }
}
```

ESLint プラグインパッケージは "eslint-plugin"というプレフィクスから始める必要があります。
今回は、プラグインパッケージは "@quramy/eslint-plugin-tutorial" という名前ですから、ESLint はこの命名規約によって "@quramy/tutorial" という名前で認識します。

さあ、それでは実行してみましょう！

```sh
$ echo "const x = 1;" | npx eslint --stdin
```

次の出力が得られましたか？

```text
<text>
  1:11  error  😿  @quramy/tutorial/no-literal

✖ 1 problem (1 error, 0 warnings)
```

## Summary

- ESLint ルールを作成するには、 `Rule.RuleModule` を実装する
- ESLint プラグイン NPM パッケージには "eslint-plugin" プレフィクスが必要である

[Next](../20_dive_into_ast/README.ja.md)
