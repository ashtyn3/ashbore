import * as parser from "@babel/parser";
import types from "@babel/types";
import types from "@babel/types";
import { func_args } from "./types";
import { func_args } from "./types";
import types from "@babel/types";
import { THIS, rootBuilder, rootBuilder } from "./builders";
import { rootBuilder } from "./builders";
import types from "@babel/types";
import types from "@babel/types";
import { rootBuilder } from "./builders";
import { THIS } from "./builders";
import types from "@babel/types";
import types from "@babel/types";

export const buildImports = (
  tree: parser.ParseResult<types.File>
): parser.ParseResult<types.File> => {
  let def_import = types.importDefaultSpecifier(types.identifier("$"));
  let baseImport = types.importDeclaration(
    [def_import],
    types.stringLiteral("ashbore")
  );

  tree.program.body.unshift(baseImport);
  return tree;
};
export const rootBuilder = (fn: string, args: func_args) =>
  types.callExpression(
    types.memberExpression(types.identifier("$"), types.identifier(fn)),
    args
  );
export const elementBuilder = (tag: string, id: types.Identifier) =>
  types.variableDeclaration("let", [
    types.variableDeclarator(id, rootBuilder("el", [types.stringLiteral(tag)])),
  ]);
export const THIS = (id: string) =>
  types.memberExpression(types.thisExpression(), types.identifier(id));
export function generateStateHolder(
  item: types.ClassProperty,
  bind?: any
): types.ExpressionStatement {
  let stateFunc = rootBuilder("STATE", [
    types.thisExpression(),
    types.stringLiteral(item.key.name),
    bind ? bind : item.value,
  ]);
  let propDef = types.assignmentExpression("=", THIS(item.key.name), stateFunc);

  return types.expressionStatement(propDef);
}
export function generateConstructor(
  parameters: (
    | types.Identifier
    | types.RestElement
    | types.TSParameterProperty
    | types.Pattern
  )[],
  body: types.BlockStatement
) {
  // Create the constructor function
  body.body.unshift(
    types.expressionStatement(
      types.callExpression(types.identifier("super"), [])
    )
  );
  const constructorFunction = types.classMethod(
    "constructor",
    types.identifier("constructor"),
    parameters,
    body // Constructor body
  );

  return constructorFunction;
}
export function generateDynamicBody(body: types.BlockStatement) {
  // Create the constructor function
  const constructorFunction = types.classMethod(
    "method",
    types.identifier("dyn_b"),
    [],
    body // Constructor body
  );

  return constructorFunction;
}
