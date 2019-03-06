import { RuleTester } from "eslint";

import rule from "./no-new-date";

const tester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });

tester.run("no-new-date", rule, {
  valid: [
    { code: `new Date(1, 2, 3)` },
    { code: `hoge.now()` },
  ],
  invalid: [
    {
      code: `Date.now()`,
      errors: [{ message: /.*/ }],
    },
    {
      code: `moment()`,
      errors: [{ message: /.*/ }],
    },
    {
      code: `new Date()`,
      errors: [{ message: /.*/ }],
    }
  ],
});
