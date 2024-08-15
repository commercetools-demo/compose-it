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
  const { selectedDatasource, availablePaths, selectedPath } =
    usePropertyDatasource({ isDatasourceSelected, value });
  const { datasources } = useBuilderStateContext();

  return (
    <>
      {isDatasourceSelected && (
        <>
          <Select
            onChange={(e) => onDatasourceSelect(e.target.value as string)}
            value={selectedDatasource}
            isCondensed
            isClearable
            options={[{ value: '', label: 'Select a datasource' }].concat(
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
