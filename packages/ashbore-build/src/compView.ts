import generator from "@babel/generator";
import { NodePath } from "@babel/traverse";
import types, { ClassDeclaration } from "@babel/types";
import { rootBuilder } from "./builders";
import { THIS } from "./builders";
import { id_gen } from "./plugin";

export function compView(
  parentPath: NodePath,
  el: types.JSXElement,
  parentId: types.Identifier,
  bindings?: types.Identifier[]
) {
  let tag = el.openingElement;
  let props: types.ObjectProperty[] = [];
  let id = id_gen();
  let name_id = types.identifier(tag.name.name.toLowerCase() + "_" + id);
  let qual_id = types.memberExpression(types.identifier("this"), name_id);
  let dy_qual_id = THIS(name_id.name);
  let attr_body: types.ExpressionStatement[] = [];
  let dyn = false;
  tag.attributes.forEach((attr) => {
    if (attr.name && attr.value) {
      if (attr.value.type == "JSXExpressionContainer") {
        let prop = types.objectProperty(
          types.identifier(attr.name.name),
          attr.value.expression
        );
        // console.log(attr.value.expression);
        if (attr.value.expression.type == "MemberExpression") {
          let exp = attr.value.expression as types.MemberExpression;
          let usedId = generator(exp).code;
          let name = usedId.split(".");
          if (name[0] == "this") {
            name.shift();
            name.forEach((s) => {
              if (parentPath.getData(s)) {
                dyn = true;
                attr_body.push(
                  types.expressionStatement(
                    types.callExpression(THIS("dyn_b"), [])
                  )
                );
              }
            });
          }
        }
        props.push(prop);
      } else {
        let prop = types.objectProperty(
          types.identifier(attr.name.name),
          attr.value
        );
        props.push(prop);
      }
    }
  });
  const classBuilder = types.newExpression(types.identifier(tag.name.name), [
    types.objectExpression(props),
  ]);
  const ClassInstance = types.assignmentExpression("=", qual_id, classBuilder);
  let parent = parentPath.node as ClassDeclaration;
  parent.body.body[0].body.body.push(types.expressionStatement(ClassInstance));
  if (dyn) {
    parent.body.body[1].body.body.push(
      types.expressionStatement(ClassInstance)
    );
  }
  parentPath.replaceWith(parent);
  // const parentSetter = types.assignmentExpression("=", types.memberExpression(id, types.identifier("parent")), parentId)
  // const render = types.callExpression(types.memberExpression(id, types.identifier("render")), []);
  let render = rootBuilder("append", [
    parentId,
    rootBuilder("CORender", [dy_qual_id]),
  ]);

  return [...attr_body, types.expressionStatement(render)];
}
