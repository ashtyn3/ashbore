import * as babel from "@babel/core";
import generator from "@babel/generator";
import * as parser from "@babel/parser";
import traverse, { Scope } from "@babel/traverse";
import types, { JSXAttribute, JSXExpressionContainer } from "@babel/types";
import { PluginBuilder, plugin } from "bun";
import { alphanumeric } from "nanoid-dictionary";
import { func_args } from "./types";

import { log } from "@clack/prompts";
import { customAlphabet } from "nanoid";
import {
  buildImports,
  elementBuilder,
  generateConstructor,
  generateDynamicBody,
  generateStateHolder,
  rootBuilder,
} from "./builders";
import { errorLog } from "./cli/utils";
import { compElement } from "./compElement";
import { compAttr } from "./compAttr";

const reserved_funcs = ["body", "dyn_b", "constructor"];
let holders = {};
export const id_gen = () => "e_" + customAlphabet(alphanumeric, 5)();

export default {
  name: "ashbore",
  async setup(build: PluginBuilder) {
    // build.onResolve({filter: /\@ashbore/}, (i) => {
    //   let name = i.path.split("/")[1];
    //   return {path: "./packages/ashbore-build/dist/"+name+".js"}
    // })
    build.onLoad({ filter: /\.tsx$/ }, async (args) => {
      const text = await Bun.file(args.path).text();
      let tree = parser.parse(text, {
        plugins: ["jsx", "typescript", "decorators"],
        allowImportExportEverywhere: true,
        errorRecovery: true,
        sourceFilename: args.path,
      });
      let boundStateHolders: types.Identifier[] = [];
      tree = buildImports(tree);
      // let newTree = parser.parse("",{plugins: ["jsx", "typescript", "decorators"], allowImportExportEverywhere: true, errorRecovery: true} )
      // newTree = buildImports(newTree);
      // const file = new File(args.path, {code: text, ast: tree })
      // console.log(file.scope)
      traverse(tree, {
        Class(path) {
          let stateHolders = [];
          let otherProps = [];
          let name = path.node.id;

          if (
            path.node.decorators?.filter((d) => {
              if ((d.expression as types.CallExpression).callee) {
                return (
                  (
                    (d.expression as types.CallExpression)
                      .callee as types.V8IntrinsicIdentifier
                  ).name == "view"
                );
              } else {
                return (d.expression as types.Identifier).name == "view";
                // errorLog(
                //   "invalid use of view.",
                //   d.loc?.filename,
                //   d.loc?.start.line,
                //   d.loc?.end.column
                // );
              }
            })
          ) {
            const documentBody = types.memberExpression(
              types.identifier("document"),
              types.identifier("body"),
            );
            tree.program.body.push(
              types.expressionStatement(
                rootBuilder("render", [
                  documentBody,
                  types.newExpression(name, []),
                ]),
              ),
            );
          }
          let constructParams: Array<types.Identifier> = [];
          // path.node.body.body.forEach((item) => {
          for (let i = 0; i < path.node.body.body.length; i++) {
            let item = path.node.body.body[i];
            if (item.type == "ClassProperty") {
              if (!item.decorators) {
                continue;
              }
              let name = item.decorators[0].expression.name;
              if (name == "state") {
                stateHolders.push(generateStateHolder(item));
                path.setData(item.key.name, item);
                // path.setData(item.key.name, true);
                // path.scope.generateDeclaredUidIdentifier(item.key.name);
                // if (holders[path.node.id?.name]) {
                //   holders[path.node.id.name].push();
                // }
              } else if (name == "binding") {
                const id = types.identifier(item.key.name);
                if (constructParams.length == 0) {
                  constructParams.push(types.identifier("props"));
                }
                stateHolders.push(
                  generateStateHolder(
                    item,
                    types.memberExpression(types.identifier("props"), id),
                  ),
                );
              } else {
                otherProps.push(item);
              }
            } else {
              otherProps.push(item);
            }
          }
          let constructor = generateConstructor(
            [...constructParams],
            types.blockStatement([...stateHolders]),
          );
          let dyn_b = generateDynamicBody(types.blockStatement([]));
          path.node.body.body = [constructor, dyn_b, ...otherProps];
          path.replaceWith(path);
          // })
        },
        ClassMethod(path) {
          let parentPath = path.findParent((p) => {
            return p.type == "ClassDeclaration";
          });
          parentPath.setData("this." + path.node.key.name, path.node);
          if (!reserved_funcs.includes(path.node.key.name)) {
            path.remove();
          }
        },
        JSXElement(path) {
          let parentPath = path.findParent((p) => {
            return p.type == "ClassDeclaration";
          });
          let el = path.node.openingElement;
          let tagName = el.name.name;

          let attrs: Array<any> = [];
          let id = types.identifier(id_gen());
          el.attributes.forEach((arg) => {
            attrs.push(...compAttr(arg, id, parentPath));
          });

          let children: Array<any> = [];
          path.node.children.forEach((element) => {
            if (element.type == "JSXText" && element.value.trim().length == 0) {
              return;
            }
            children.push(
              compElement(parentPath, element, id, boundStateHolders).flat(),
            );
          });
          let body = [
            elementBuilder(tagName, id),
            ...attrs,
            ...children.flat(),
            types.returnStatement(id),
          ];
          path.replaceWithMultiple(body);
        },
      });

      // const documentBody = types.memberExpression(
      //   types.identifier('document'),
      //   types.identifier('body')
      // );

      // tree.program.body.push(rootBuilder("render", [types.newExpression()]))

      return {
        contents: generator(tree.program).code,
        loader: "ts",
      };
    });
  },
};
