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

The above rule is still empty and says nothing when given invalid source codes so `npm test` must fail.

## Visualize AST

Before coding the rule, think about the pattern of the source code we want to find and ban.

A JavaScript program source code is recognized as AST in ESLint world.
Therefore "the pattern of source code" can be paraphrased as "the pattern of AST".

So let's demystify the shape of AST for `fn.apply(this, ['hoge'])`, which is an invalid code example for the rule.

The following figure is a visualization of the corresponding AST.

![ast_diagram](./ast_diagram.png)

AST is tree structural data representation.
You can see and inspect AST of your source code using https://astexplorer.net .

![astexplorer](./astexplorer.png)

https://astexplorer.net/#/gist/76acd406762b142f796a290efaba423e/f721eb98505736ec48892ab556517e30d2a24066

## AST of ESLint

A parser(e.g. acorn, esprima, babylon, typescript-eslint-parser, etc...) in ESLint parses JavaScript source program to a syntax tree and an element of this tree is called "Node".
Node is defined as the following interface:

```ts
interface BaseNodeWithoutComments {
  // Every leaf interface that extends BaseNode must specify a type property.
  // The type property should be a string literal. For example, Identifier
  // has: `type: "Identifier"`
  type: string;
  loc?: SourceLocation | null;
  range?: [number, number];
}
```

As mentioned above, we've got an AST object for `fn.apply(this, ['hoge'])` via AST explorer and found this tree has an "ExpressionStatement" object.
This object is also one type of node.
And the node's `type` is the string value `"ExpressionStatement"`.

Well, let's return to the rules of ESLint.

In the previous chapter, we wrote a simple rule such as:

```ts
const rule: Rule.RuleModule = {
  create: (context) => {
    return {
      Literal: (node) => {
        // Do something
      },
    };
  }
};
```

The `create` function returns an object whose key name is `Literal`.
Where does the key "Literal" come from?
It's type name of literal AST node and ESLint calls the handler function in response to this name.

We can use more complex keys called "Selector" in the object.
Selector is very similar to CSS query in HTML.

For example, the following is a selector to find a literal node in a function calling expression.

```text
"CallExpression Literal"
```

This is an example of descendant query.
The selector notation is almost the same as the CSS query notation.
See https://github.com/estools/esquery if you want other query syntax.

## Build selector
So, let's build a selector query to find calling apply functions such as `fn.apply(this, ['hoge'])`.

esquery demo app is very useful to do that.

* Open http://estools.github.io/esquery/
* Type `fn.apply(this, ['hoge'])` at the top text area
* Type `CallExpression` to the next text input

![esquery](./esquery.png)

This tool tell us whether the input query hits the input source code AST.

Now we want to find calling `.apply` and this can be factored as the following:

* CallExpression node
* MemberExpression node
* Identifier node whose name "apply"

And already we've know the AST structure of `fn.apply(this, ['hoge'])` by the AST explorer result.
Think about which query matches using them.

Do you reach the answer?
The following query will hit.

```
CallExpression > MemberExpression > Identifier.property[name='apply']
```

Let's complete our "no-function-apply" rule.

```ts
/* src/rules/no-function-apply.ts */

import { Rule } from "eslint";
import { Node } from "estree";

const rule: Rule.RuleModule = {
  create: (context) => {
    return {
      "CallExpression > MemberExpression > Identifier.property[name='apply']": (node: Node) => {
        context.report({
          message: "Don't use 'apply'",
          node,
        });
      }
    };
  }
};

export = rule;
```

Finally, run `npm test` once again. It should exit successfully :sunglasses:

## Appendix: "field" syntax of esquery
Did you notice that we used `Identifier.property[name='apply']` rather than `Identifier[name='apply']` ?
The part `.property` is called "field" in esquery syntax.
`Identifier.property` means "Identifier node which is located as `property` field at the parent node".

Why do we use this syntax ?
Does not `Identifier[name='apply']` satisfy for our rule ?

No it doesn't.

`fn.apply` is parsed to a MemberExpression node and this node 2 child nodes and both nodes have the same type "Identifier".

```js
{
  type: "MemberExpression",
  object: {
    type: "Identifier",
    name: "fn"
  },
  property: {
    type: "Identifier",
    name: "apply"
  }
}
```

So our rule reports an error for valid code `apply.hoge()` if we use `Identifier[name='apply']`.

We can pick up only the second Identifier node using `Identifier.property` selector.

## Summary

* We can use AST selector as object keys in ESlint rule
* We can inspect AST via https://astexplorer.net
* We can check selector queries via http://estools.github.io/esquery

[Previous](../10_your_first_rule/README.md)
[Next](../30_other_parsers/README.md)
