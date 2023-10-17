import types, { JSXAttribute, JSXExpressionContainer } from "@babel/types";
import { func_args } from "./types";
import { rootBuilder } from "./builders";
import { id_gen } from "./plugin";
import generator from "@babel/generator";

export function compAttr(
  arg: types.JSXAttribute | types.JSXSpreadAttribute,
  id: types.Identifier,
  parentPath: any,
): any[] {
  let args: func_args = [id];
  let attr = arg as JSXAttribute;
  let attrs = [];
  args.push(types.stringLiteral(attr.name.name));
  if (attr.value?.type == "JSXExpressionContainer") {
    if (
      attr.value.expression.type.includes("FunctionExpression") ||
      attr.name.name.toString().includes("on")
    ) {
      let func_id = types.identifier(id_gen());
      let v = types.variableDeclaration("const", [
        types.variableDeclarator(func_id, attr.value.expression),
      ]);
      attrs.push(v);
      if (
        !attr.value.expression.type.includes("FunctionExpression") &&
        attr.name.name.toString().includes("on")
      ) {
        let event = attr.name.name.toString().replace("on", "").toLowerCase();
        let p: types.ClassMethod = parentPath.getData(
          generator(attr.value.expression).code,
        );
        // TODO FINISH THIS

        attrs.push(
          types.expressionStatement(
            rootBuilder("listen", [
              id,
              types.stringLiteral(event),
              types.arrowFunctionExpression([], p.body),
            ]),
          ),
        );
      } else if (attr.name.name.toString().includes("on")) {
        let event = attr.name.name.toString().replace("on", "").toLowerCase();
        attrs.push(
          types.expressionStatement(
            rootBuilder("listen", [id, types.stringLiteral(event), func_id]),
          ),
        );
      } else {
        console.error("invalid function attribute value");
      }
      return attrs;
    } else {
      let value = attr.value as JSXExpressionContainer;
      args.push(value.expression);
    }
  } else if (attr.value?.type == "StringLiteral") {
    args.push(attr.value);
  }
  let attrBuilder = rootBuilder("attr", args);
  attrs.push(types.expressionStatement(attrBuilder));
  return attrs;
}
