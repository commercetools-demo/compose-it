import React, { useState } from 'react';
import Select from '@commercetools-uikit/select-input';
import { ENTITY_ACTIONT_TYPES } from '../../library/general';
import RouteSelector from './route-selector';
import ActionSelector from './action-selector';

type EventAction = {
  type: 'route' | keyof typeof ENTITY_ACTIONT_TYPES;
  value: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const EventEditorInput: React.FC<Props> = ({ value, onChange }) => {
  const [action, setAction] = useState<EventAction>(() => {
    try {
      return JSON.parse(value);
    } catch {
      return { type: null, value: '' };
    }
  });

  const handleActionTypeChange = (value?: string) => {
    const newAction = {
      ...action,
      type: value as EventAction['type'],
    };
    setAction(newAction);
    onChange(JSON.stringify(newAction));
  };

  const handleActionValueChange = (value?: string) => {
    const newAction = { ...action, value: value || '' };
    setAction(newAction);
    onChange(JSON.stringify(newAction));
  };

  const renderActionInput = () => {
    switch (action.type) {
      case 'route':
        return (
          <RouteSelector
            value={action.value}
            onChange={handleActionValueChange}
          />
        );
      default:
        return (
          <ActionSelector
            isActionSelected
            value={action.value}
            onActionSelect={handleActionValueChange}
          />
        );
    }
  };

  return (
    <div>
      <Select
        options={[
          { value: 'route', label: 'Route' },
          ...ENTITY_ACTIONT_TYPES,
        ]}
        value={action.type}
        placeholder="Select an action"
        isClearable
        isCondensed
        onChange={(event) =>
          handleActionTypeChange(event.target.value as string)
        }
      />
      {renderActionInput()}
    </div>
  );
};

export default EventEditorInput;
