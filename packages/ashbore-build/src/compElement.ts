import { NodePath } from "@babel/traverse";
import types from "@babel/types";
import { elementBuilder, rootBuilder } from "./builders";
import { compView } from "./compView";
import { id_gen } from "./plugin";
import { compAttr } from "./compAttr";

export function compElement(
  parentPath: NodePath,
  el: types.JSXElement | types.JSXText | types.JSXExpressionContainer,
  parentId: types.Identifier,
  bindings: types.Identifier[],
) {
  if (el.type == "JSXText") {
    return [
      types.expressionStatement(
        rootBuilder("append", [parentId, types.stringLiteral(el.value)]),
      ),
    ];
  }
  if (el.type == "JSXExpressionContainer") {
    let id = id_gen();
    let v = types.variableDeclaration("const", [
      types.variableDeclarator(
        types.identifier(id),
        el.expression as types.Expression,
      ),
    ]);
    let d = types.expressionStatement(
      rootBuilder("append", [parentId, types.identifier(id)]),
    );
    return [v, d];
  }
  let tagName = (el.openingElement.name as types.JSXIdentifier).name;
  if (/^[A-Z]/.test(tagName)) {
    return compView(parentPath, el, parentId);
  }
  let args = [types.stringLiteral(tagName)];
  // newTree.program.body.push(elementBuilder(tagName))
  let attrs: Array<any> = [];
  let id = types.identifier(id_gen());
  el.openingElement.attributes.forEach((arg) => {
    attrs.push(...compAttr(arg, id, parentPath));
  });

  let childrenProc: Array<any> = [];
  el.children.forEach((element) => {
    if (element.type == "JSXText" && element.value.trim().length == 0) {
      return;
    }
    childrenProc.push(compElement(parentPath, element, id, bindings).flat());
  });

  let body = [
    elementBuilder(tagName, id),
    ...childrenProc.flat(),
    ...attrs,
    types.expressionStatement(rootBuilder("append", [parentId, id])),
  ];

  return body;
}
