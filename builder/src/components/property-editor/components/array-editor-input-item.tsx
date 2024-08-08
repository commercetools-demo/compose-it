import React from 'react';
import TextInput from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import { CloseIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';

type Props = {
  index: number;
  item: object;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  remove: (index: number) => void;
};

const ArrayEditoInputItem = ({ index, item, remove, handleChange }: Props) => {
  return (
    <Spacings.Inline key={`value.${index}`}>
      <TextInput
        isCondensed
        title="Key"
        name={`value.${index}.key`}
        value={item.key}
        onChange={handleChange}
      />

      <TextInput
        title="Label"
        isCondensed
        name={`value.${index}.label`}
        value={item.label}
        onChange={handleChange}
      />
      <IconButton
        type="button"
        label="Remove"
        onClick={() => remove(index)}
        icon={<CloseIcon />}
      />
    </Spacings.Inline>
  );
};

export default ArrayEditoInputItem;
