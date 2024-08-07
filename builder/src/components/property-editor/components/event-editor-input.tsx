import React, { useState } from 'react';
import Select from '@commercetools-uikit/select-input';
import TextInput from '@commercetools-uikit/text-input';

type EventAction = {
  type: 'route' | 'custom';
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
      return { type: 'route', value: '' };
    }
  });

  const handleActionTypeChange = (event: { target: { value: string } }) => {
    const newAction = { ...action, type: event.target.value as 'route' | 'custom' };
    setAction(newAction);
    onChange(JSON.stringify(newAction));
  };

  const handleActionValueChange = (event: { target: { value: string } }) => {
    const newAction = { ...action, value: event.target.value };
    setAction(newAction);
    onChange(JSON.stringify(newAction));
  };

  return (
    <div>
      <Select
        options={[
          { value: 'route', label: 'Route' },
          { value: 'custom', label: 'Custom Action' },
        ]}
        value={action.type}
        onChange={handleActionTypeChange}
      />
      <TextInput
        value={action.value}
        onChange={handleActionValueChange}
        placeholder={action.type === 'route' ? 'Enter route' : 'Enter custom action'}
      />
    </div>
  );
};

export default EventEditorInput;