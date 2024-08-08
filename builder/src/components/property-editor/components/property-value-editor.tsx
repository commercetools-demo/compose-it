import React from 'react';
import { PropsBindingState } from '../../library/general';
import ArrayEditorInput from './array-editor-input';
import EventEditorInput from './event-editor-input';
import Text from '@commercetools-uikit/text-field';

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
  if (!propsBinding) {
    return null;
  }
  if (propsBinding.dataType === 'array') {
    return <ArrayEditorInput value={value as object[]} onChange={onChange} />;
  }
  if (propsBinding.dataType === 'event') {
    return <EventEditorInput value={value as string} onChange={onChange} />;
  }
  return (
    <Text
      isCondensed
      title="Enter a value"
      value={propsBinding.value as string}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default PropertyValueEditor;
