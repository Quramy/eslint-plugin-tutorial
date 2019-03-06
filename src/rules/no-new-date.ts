import { Rule } from "eslint";
import { Node, MemberExpression, NewExpression } from "estree";

const rule: Rule.RuleModule = {
  create: (context) => {
    return {
      "CallExpression > MemberExpression > Identifier.property[name='now']": (node: Node) => {
        const parent = context.getAncestors().pop() as MemberExpression;
        const objectNode = parent.object;
        if (objectNode.type === "Identifier" && objectNode.name === "Date") {
          context.report({
            message: "Don't use 'Date.now()'",
            node,
          });
        }
      },
      "CallExpression > Identifier[name='moment']": (node: Node) => {
        context.report({
          message: "Don't use 'moment()'",
          node,
        });
      },
      "NewExpression > Identifier.callee[name='Date']": (node: Node) => {
        const parent = context.getAncestors().pop() as NewExpression;
        if (!parent.arguments.length) {
          context.report({
            message: "Don't use 'new Date()'",
            node,
          });
        }
      },
    };
  }
};

export = rule;
