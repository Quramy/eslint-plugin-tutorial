# Your first rule
In this chapter, let's learn to how create ESLint plugin.

## Create a rule module
First of all, put a new file as `src/rules/no-literal.ts` and edit it as the following:

```ts
import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  create: (context) => {
    return {
      Literal: (node) => {
        context.report({
          message: "😿",
          node,
        });
      },
    };
  }
};

export = rule;
```

Congrats! This is your first ESLint rule!

This is a very silly rule, which says crying cat emoji when it finds some literals(e.g. `1`, `'hoge'`, ...).
However, it tells us various things.

* ESLint rule should implements `RuleModule` interface
  * It should have `create` function which has an argument, `context`
* `create` method should return an object
  * This object's keys represents AST node type which we are interested (We learn the relation between AST node type and the keys later :smile:)
  * It's value is a function and an error message is thrown in this function

## Test the rule
Next, let's test that this rule works.

Put another file, `src/rules/no-literal.test.ts` and edit:

```ts
import { RuleTester } from "eslint";

import rule from "./no-literal";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run("no-reteral", rule, {
  valid: [
    { code: `let x` },
  ],
  invalid: [
    {
      code: `const x = 1;`,
      errors: [{ message: "😿" }],
    }
  ],
});
```

And run this test code via:

```sh
$ yarn test
```

Can you see the following console output?

```text
PASS src/rules/no-literal.test.ts
  no-reteral
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

1. If given a valid source code, your rule says nothing
1. If given an invalid source code, your rules reports an error message(:crying_cat_face:)

## Create plugin
So, let's prepare to publish our rule as an ESLint plugin.

ESLint plugin needs index file which tells the name of the rule module.

Put src/index.ts and edit as the following:

```ts
import noLiteral from "./rules/no-literal";

export = {
  rules: {
    "no-literal": noLiteral,
  },
};
```

Before executing `npm publish`, confirm our first plugin works within an NPM project.

Execute the following command under eslint-plugin-tutorial directory(Use `yarn` instead of `npm` if you prefer):

```sh
$ npm link
```

Then we can install this package via npm command.

Next, create a sample project to use our plugin.

```sh
$ cd ..
$ mkdir example-prj
$ cd example-prj
$ npm init -f
$ npm i eslint --dev
```

We add our plugin into the sample project:

```sh
$ npm link @quramy/eslint-plugin-tutorial
```

Finally, put .eslintrc and configure to use our plugin.

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

An ESLint plugin package should have "eslint-plugin" prefix. 
Now, our plugin's package json is named as "@quramy/eslint-plugin-tutorial" so ESLint recognises it as "@quramy/tutorial" using this naming convention.

Ok come on, run it!

```sh
$ echo "const x = 1;" | npx eslint --stdout
```

Can you see the following ?

```text
<text>
  1:11  error  😿  @quramy/tutorial/no-literal

✖ 1 problem (1 error, 0 warnings)
```

## Summary

* You implement `Rule.RuleModule` to create a ESLint rule
* ESLint plugin NPM package should have "eslint-plugin" prefix

[Next](../20_dive_into_ast/README.md)
