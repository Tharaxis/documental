import ts from "typescript";
import { parseDescription, parseFields } from ".";
import { TypeInfo, FieldInfo } from "../model";

/**
 * Parses a function declaration node.
 * @param typeChecker The type checker instance.
 * @param declaration The declaration to parse.
 * @returns The type information, or null if not able to be parsed.
 */
export function parseFunctionDeclaration(typeChecker: ts.TypeChecker, declaration: ts.FunctionDeclaration): TypeInfo | null {
  const { name, parameters, type: typeNode } = declaration;
  if (!name) return null;

  const symbol = typeChecker.getSymbolAtLocation(name);
  if (!symbol) return null;

  const description = parseDescription(typeChecker, symbol);
  const returnDescription = ts.getJSDocReturnTag(declaration)?.comment;

  const fields = parameters.map((parameter): FieldInfo => {
    const parameterDescription = ts.getJSDocParameterTags(parameter)?.[0]?.comment;
    const { type: parameterTypeNode } = parameter;

    let types: ReadonlyArray<string> = [];

    if (parameterTypeNode) {
      const parameterType = typeChecker.getTypeFromTypeNode(parameterTypeNode);
      types = [typeChecker.typeToString(parameterType)];
    }

    return {
      name: parameter.name.getText(),
      optional: !!parameter.questionToken,
      types,
      description: (typeof parameterDescription === "string") ? parameterDescription : undefined
    }
  });

  let returnTypes: ReadonlyArray<string> = [];

  if (typeNode) {
    const type = typeChecker.getTypeFromTypeNode(typeNode);
    returnTypes = [typeChecker.typeToString(type)];
  }

  return {
    id: name.text,
    type: "function",
    actualType: "function",
    name: name.text,
    parameters: fields,
    returnDescription: (typeof returnDescription === "string") ? returnDescription : undefined,
    returnTypes,
    description
  };
}
