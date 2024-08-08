import { useBuilderStateContext } from '../../../providers/process';
import { useMemo } from 'react';
import Select from '@commercetools-uikit/select-input';

type Props = {
  isActionSelected: boolean;
  value?: string | number | unknown[] | boolean | object | null;
  onActionSelect: (actionKey?: string) => void;
};

const ActionSelector = ({ isActionSelected, value, onActionSelect }: Props) => {
  const { actions } = useBuilderStateContext();

  const selectedAction = useMemo(
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
          <Select
            isCondensed
            onChange={(e) => onActionSelect(e.target.value as string)}
            value={selectedAction}
            options={actions?.results.map((action) => ({
              value: action.key,
              label: action.value?.name,
            }))}
            placeholder="Select an action"
          ></Select>
        </>
      )}
    </>
  );
};

export default ActionSelector;
