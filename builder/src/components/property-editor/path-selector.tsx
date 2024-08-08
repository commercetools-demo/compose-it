import React from 'react';
import Select from '@commercetools-uikit/select-field';

interface PathSelectorProps {
  paths: string[];
  value?: string;
  onSelect: (path: string) => void;
}

export const PathSelector: React.FC<PathSelectorProps> = ({
  paths,
  value,
  onSelect,
}) => {
  return (
    <Select
      onChange={(e) => onSelect(e.target.value)}
      value={value}
      isClearable
      isCondensed
      options={[{ value: undefined, label: '' }].concat(
        paths.map((path) => ({
          value: path,
          label: path,
        }))
      )}
      title="Path"
      placeholder="Select a path"
    ></Select>
  );
};
