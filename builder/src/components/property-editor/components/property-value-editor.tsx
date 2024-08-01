import React from 'react';
import { PropsBindingState } from '../../library/general';
import ArrayEditorInput from './array-editor-input';

type Props = {
  componentType: string;
  propsBinding: PropsBindingState;
  value: string | number | boolean | null | object;
  onChange: (value: string | number | boolean | object) => void;
};

/// TODO: imagine a config like this provided by user for displaying property value editor

// const BuilderConfiguredValueEditors = {
//   DataTable: {
//     columns: <ArrayEditorInput  />
//   }
// }

const PropertyValueEditor = ({ propsBinding, value, onChange }: Props) => {
  if (propsBinding.dataType === 'array') {
    return <ArrayEditorInput value={value as string[]} onChange={onChange} />;
  }
  return (
    <input
      type="text"
      value={propsBinding.value as string}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default PropertyValueEditor;
