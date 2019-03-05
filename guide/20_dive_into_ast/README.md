# Dive into AST

We already learned how to write ESLint rule module.
In this chapter, let's learn the relation ESLint rules and AST(Abstract Syntax Tree) analysis.
In other words, we'll learn how to find the part you want to ban from the source code!

## Subject

The goal of this chapter is creating a rule which finds a part of source code calling `apply` of some functions.
For example:

```js
const fn = (x) => console.log(x);
fn.apply(this, ['hoge']); // We want to ban it!
```

Let's adopt the TDD approach.

First, we write a test for this rule.
Put a new test file as `src/rules/no-function-apply.test.ts` and edit the following:

```ts
import { RuleTester } from "eslint";

import rule from "./no-function-apply";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run("no-function-apply", rule, {
  valid: [
    { code: `fn('hoge')` },
  ],
  invalid: [
    {
      code: `fn.apply(this, ['hoge'])`,
      errors: [{ message: "Don't use 'apply'" }],
    }
  ],
});
```

And create a rule module corresponding it.

```ts
/* src/rules/no-function-apply.ts */

import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  create: (context) => {
    return {
      // To be implemented later
    };
  }
};

export = rule;
```

The above rule is still empty and says nothing when given invalid source codes so `npm test` will fail.

## AST

Before coding the rule, think about the pattern of the source code we want to find and ban.

A JavaScript program source code is recognized as AST in ESLint world.
Therefore "the pattern of source code" can be paraphrased as "the pattern of AST".

So let's demystify the shape of AST for `fn.apply(this, ['hoge'])`, which is an invalid code example for the rule.

The following figure is a visualization of the corresponding AST.

![ast_diagram](./ast_diagram.png)

AST is tree structural data representation.
You can see and inspect AST of your source code using https://astexplorer.net .

![astexplorer](./astexplorer.png)

