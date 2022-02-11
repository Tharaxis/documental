import ts from "typescript";
import { parseDescription } from "./parseDescription";

/**
 * Parses the specified declaration list.
 * @param typeChecker The type checker instance.
 * @param declarationList The variable declaration list to parse.
 * @returns A tuple containing the name and type of the declaration, or null if could not parse.
 */
export function parseDeclarationInfo(typeChecker: ts.TypeChecker, declarationList: ts.VariableDeclarationList):
 [
   name: string,
   description: string,
   type: ts.Type
 ] | null {
 const {declarations} = declarationList;
 const [declaration] = declarations;

 const declarationSymbol = typeChecker.getSymbolAtLocation(declaration.name);
 if (!declarationSymbol) return null;
 const { valueDeclaration } = declarationSymbol;
 if (!valueDeclaration) return null;

 const name = declarationSymbol.name;
 const description = parseDescription(typeChecker, declarationSymbol);
 const type = typeChecker.getTypeOfSymbolAtLocation(declarationSymbol, valueDeclaration);

 return [name, description, type];
}
