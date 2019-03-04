import { RuleTester } from "eslint";

import rule from "./no-hoge-string";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

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
