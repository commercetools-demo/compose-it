import { usePropertyDatasource } from '../hooks/use-property-datasource';
import { useBuilderStateContext } from '../../../providers/process';
import { PathSelector } from '../path-selector';
import { useMemo } from 'react';
type Props = {
  isDatasourceSelected: boolean;
  value?: string | number | unknown[] | boolean | object | null;
  onDatasourceSelect: (datasourceKey?: string, path?: string) => void;
};

const DatasourceSelector = ({
  isDatasourceSelected,
  value,
  onDatasourceSelect,
}: Props) => {
  const { extractPaths } = usePropertyDatasource();
  const { datasources } = useBuilderStateContext();

  const selectedDatasource = useMemo(
    () =>
      isDatasourceSelected && typeof value === 'string' && !!value
        ? value?.split('.')?.[0]
        : '',
    [value]
  );

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
  }, [selectedDatasource]);

  const selectedPath = useMemo(() => {
    return isDatasourceSelected && typeof value === 'string' && !!value
      ? value?.split('.').slice(1).join('.')
      : '';
  }, [value]);

  return (
    <>
      {isDatasourceSelected && (
        <>
          <select
            onChange={(e) => onDatasourceSelect(e.target.value)}
            value={selectedDatasource}
          >
            <option value="">Select a datasource</option>
            {datasources?.results.map((datasource) => (
              <option key={datasource.key} value={datasource.key}>
                {datasource.value?.name}
              </option>
            ))}
          </select>
          {selectedDatasource && (
            <PathSelector
              paths={availablePaths}
              value={selectedPath}
              onSelect={(path) => onDatasourceSelect(selectedDatasource, path)}
            />
          )}
        </>
      )}
    </>
  );
};

export default DatasourceSelector;
