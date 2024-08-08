import { usePropertyDatasource } from '../hooks/use-property-datasource';
import { useBuilderStateContext } from '../../../providers/process';
import { PathSelector } from '../path-selector';
import { useMemo } from 'react';
import Select from '@commercetools-uikit/select-field';

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
          <Select
            onChange={(e) => onDatasourceSelect(e.target.value as string)}
            value={selectedDatasource}
            isCondensed
            isClearable
            options={[{ value: undefined, label: '' }].concat(
              datasources?.results.map((datasource) => ({
                value: datasource.key,
                label: datasource.value?.name,
              }))
            )}
            title="Datasource"
            placeholder="Select a datasource"
          ></Select>
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
