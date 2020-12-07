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
