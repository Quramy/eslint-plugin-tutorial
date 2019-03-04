import { RuleTester } from "eslint";

import rule from "./no-hoge-string";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

// @ts-ignore
RuleTester.describe = function(text, method) {
  // @ts-ignore
  RuleTester.it.title = text;
  return method.call(this);
};

// @ts-ignore
RuleTester.it = function(text, method) {
  // @ts-ignore
  test(RuleTester.it.title + ": " + text, method);
};

tester.run("no-hoge-string", rule, {
  valid: [
    { code: `let x` },
  ],
  invalid: [
    {
      code: `const x = 1;`,
      errors: [{ message: "にゃーん" }],
    }
  ],
});
