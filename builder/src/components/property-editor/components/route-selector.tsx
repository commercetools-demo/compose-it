import { useAppContext } from '../../../providers/app';
import Select from '@commercetools-uikit/select-field';

type Props = {
  value?: string;
  onChange?: (value?: string) => void;
};

const RouteSelector = ({ value, onChange }: Props) => {
  const {
    appConfig: { pages },
  } = useAppContext();
  return (
    <Select
      title="Page"
      options={pages.map((page) => ({ value: page.route, label: page.name }))}
      isCondensed
      value={value}
      onChange={(event) => onChange?.(event.target.value as string)}
    />
  );
};

export default RouteSelector;
