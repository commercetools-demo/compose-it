import { parse, visit, OperationDefinitionNode, FieldNode } from 'graphql';

export const usePropertyDatasource = () => {
  const extractPaths = (query: string): string[] => {
    const paths: string[] = [];
    const ast = parse(query);

    visit(ast, {
      OperationDefinition(node: OperationDefinitionNode) {
        if (node.operation === 'query') {
          const extractFieldPaths = (
            node: FieldNode,
            parentPath: string = 'data'
          ) => {
            const currentPath = `${parentPath}.${node.name.value}`;
            paths.push(currentPath);

            if (node.selectionSet) {
              node.selectionSet.selections.forEach((selection) => {
                if (selection.kind === 'Field') {
                  extractFieldPaths(selection, currentPath);
                }
              });
            }
          };

          node.selectionSet.selections.forEach((selection) => {
            if (selection.kind === 'Field') {
              extractFieldPaths(selection);
            }
          });
        }
      },
    });
    return paths;
  };
  return { extractPaths };
};
