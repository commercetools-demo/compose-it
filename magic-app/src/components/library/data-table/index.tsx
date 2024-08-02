import CommercetoolsDataTable, {
  TDataTableProps,
} from '@commercetools-uikit/data-table';
import { get } from 'lodash';

const DataTable = (props: TDataTableProps) => {
  let { columns } = props;
  if (columns && columns.length > 0) {
    columns = columns.map((column) => {
      return {
        ...column,
        renderItem: (row: any) => {
          return <>{get(row, column.key) || row[column.key]}</>;
        },
      };
    });
  }

  return <CommercetoolsDataTable {...props} columns={columns} />;
};

export default DataTable;
