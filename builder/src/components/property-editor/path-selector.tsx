import React from 'react';

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
    <select onChange={(e) => onSelect(e.target.value)} value={value}>
      <option value="">Select a path</option>
      {paths.map((path, index) => (
        <option key={index} value={path}>
          {path}
        </option>
      ))}
    </select>
  );
};
