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
