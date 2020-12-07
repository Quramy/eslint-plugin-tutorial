import { RuleTester } from "eslint";

import rule from "./no-function-apply";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run("no-function-apply", rule, {
  valid: [{ code: `fn('hoge')` }, { code: `apply.fn('hoge')` }, { code: `apply('hoge')` }, { code: `fn.apply` }],
  invalid: [
    {
      code: `fn.apply(this)`,
      errors: [{ message: "Don't use 'apply'" }],
    },
    {
      code: `fn.apply(this, ['hoge'])`,
      errors: [{ message: "Don't use 'apply'" }],
    },
    {
      code: `foo.bar.apply(this, ['hoge'])`,
      errors: [{ message: "Don't use 'apply'" }],
    },
  ],
});
