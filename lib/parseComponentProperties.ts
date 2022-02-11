import ts from "typescript";
import { parseDescription } from "./parseDescription";
import { PropertyInfo } from "./PropertyInfo";

/**
 * Parses the properties for the specified component type.
 * @param typeChecker The type checker instance.
 * @param componentType The component type to parse properties for.
 * @returns The list of properties.
 */
export function parseComponentProperties(typeChecker: ts.TypeChecker, componentType: ts.Type): ReadonlyArray<PropertyInfo> {
  const { aliasTypeArguments } = componentType;
  const properties: Array<PropertyInfo> = [];

  if (aliasTypeArguments && aliasTypeArguments.length > 0) {

    // First generic parameter for FC or VFC is the property type.
    const [propsType] = aliasTypeArguments;

    for (const property of propsType.getProperties()) {
      const { valueDeclaration } = property;
      if (!valueDeclaration) continue;
      if (!ts.isPropertySignature(valueDeclaration)) continue;

      const { type } = valueDeclaration;
      if (!type) continue;

      const propertyType = typeChecker.getTypeFromTypeNode(type);

      const name = property.name;
      const description = parseDescription(typeChecker, property);
      const optional = ((property.flags & ts.SymbolFlags.Optional) !== 0);
      let types = (propertyType.isUnion()) ?
        propertyType.types.map((type) => typeChecker.typeToString(type)) :
        [typeChecker.typeToString(propertyType)];

        // replace true/false union with boolean.
        if (types.includes("false") && types.includes("true") && !types.includes("boolean")) {
        types = types.filter((type) => type !== "true");
        types[types.indexOf("false")] = "boolean";
      }

      properties.push({
        name,
        description,
        optional,
        types
      });
    }
  }

  return properties;
}
