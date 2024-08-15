import { parse, visit, OperationDefinitionNode, FieldNode } from 'graphql';
import { useMemo } from 'react';
import { useBuilderStateContext } from '../../../providers/process';

type Props = {
  isDatasourceSelected?: boolean;
  value?: string | number | unknown[] | boolean | object | null;
};

export const usePropertyDatasource = (props?: Props) => {
  const { datasources } = useBuilderStateContext();

  function extractPath(data?: string): string {
    if (!data) {
      return '';
    }
    return data.split('.').slice(1).join('.');
  }

  function extractDatasource(data?: string): string {
    if (!data) {
      return '';
    }
    return data.split('.')?.[0];
  }
  const selectedDatasource = useMemo(
    () =>
      props?.isDatasourceSelected &&
      typeof props?.value === 'string' &&
      !!props?.value
        ? extractDatasource(props.value)
        : '',
    [props?.value, props?.isDatasourceSelected]
  );

  const selectedPath = useMemo(() => {
    return props?.isDatasourceSelected &&
      typeof props?.value === 'string' &&
      !!props?.value
      ? extractPath(props.value)
      : '';
  }, [props?.value, props?.isDatasourceSelected]);

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

  function extractSubPaths(query: string, subPath: string): string[] {
    const paths: string[] = [];
    const ast = parse(query);
    const subPathParts = subPath.split('.');

    visit(ast, {
      OperationDefinition(node: OperationDefinitionNode) {
        if (node.operation === 'query') {
          const extractFieldPaths = (
            node: FieldNode,
            currentPath: string[] = []
          ) => {
            const newPath = [...currentPath, node.name.value];

            if (newPath.join('.') === subPath) {
              // We've reached the subPath, start collecting paths from here
              const collectSubPaths = (
                subNode: FieldNode,
                subCurrentPath: string = subPath
              ) => {
                const subNewPath = `${subCurrentPath}.${subNode.name.value}`;
                paths.push(subNewPath);

                if (subNode.selectionSet) {
                  subNode.selectionSet.selections.forEach((selection) => {
                    if (selection.kind === 'Field') {
                      collectSubPaths(selection, subNewPath);
                    }
                  });
                }
              };

              node.selectionSet?.selections.forEach((selection) => {
                if (selection.kind === 'Field') {
                  collectSubPaths(selection);
                }
              });
            } else if (
              newPath.length < subPathParts.length &&
              newPath.every((part, index) => part === subPathParts[index])
            ) {
              // We're still traversing to reach the subPath
              if (node.selectionSet) {
                node.selectionSet.selections.forEach((selection) => {
                  if (selection.kind === 'Field') {
                    extractFieldPaths(selection, newPath);
                  }
                });
              }
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
  }

  const availablePaths = useMemo(() => {
    if (selectedDatasource) {
      const datasource = datasources?.results.find(
        (d) => d.key === selectedDatasource
      );
      if (datasource?.value?.query) {
        const extractedPaths = extractPaths(datasource?.value?.query || '');
        return extractedPaths;
      }
    }
    return [];
  }, [selectedDatasource, datasources]);
  const getAvailableSubPaths = (fullpath: string | any) => {
    if (!fullpath || typeof fullpath !== 'string') {
      return [];
    }

    const datasource = extractDatasource(fullpath);
    // remove the data. from the path
    const path = extractPath(extractPath(fullpath));

    if (datasource && path) {
      const ds = datasources?.results.find((d) => d.key === datasource);
      if (ds?.value?.query) {
        const extractedPaths = extractSubPaths(ds?.value?.query || '', path);
        return extractedPaths;
      }
    }
    return [];
  };
  return {
    extractPath,
    extractPaths,
    extractDatasource,
    getAvailableSubPaths,
    selectedDatasource,
    availablePaths,
    selectedPath,
  };
};
