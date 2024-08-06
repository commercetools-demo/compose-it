import { useBuilderStateContext } from '../../../providers/process';
import { useMemo } from 'react';
type Props = {
  isActionSelected: boolean;
  value?: string | number | unknown[] | boolean | object | null;
  onActionSelect: (actionKey?: string) => void;
};

const ActionSelector = ({ isActionSelected, value, onActionSelect }: Props) => {
  const { actions } = useBuilderStateContext();

  const selectedDatasource = useMemo(
    () =>
      isActionSelected && typeof value === 'string' && !!value
        ? value?.split('.')?.[0]
        : '',
    [value]
  );

  return (
    <>
      {isActionSelected && (
        <>
          <select
            onChange={(e) => onActionSelect(e.target.value)}
            value={selectedDatasource}
          >
            <option value="">Select an action</option>
            {actions?.results.map((action) => (
              <option key={action.key} value={action.key}>
                {action.value?.name}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};

export default ActionSelector;
