import CommercetoolsTextInput, {
  TTextInputProps,
} from '@commercetools-uikit/text-input';
import { useFormikContext } from 'formik';

const TextInput = (props: TTextInputProps) => {
  const { values, handleChange } = useFormikContext();
  if (!props.name) {
    return null;
  }
  return (
    <CommercetoolsTextInput
      {...props}
      value={values?.[props.name]}
      onChange={handleChange}
    />
  );
};

export default TextInput;
