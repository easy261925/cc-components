# 可编辑表格 EditTable

可编辑表格

```tsx
import { Form } from 'antd';
import { EditTable } from 'cc-ui';
import moment from 'moment';

export default () => {
  const [form] = Form.useForm();

  const columns: CommonColumnsType<CarbonFacilityEntity>[] = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      search: true,
      editable: true,
    },
    {
      title: '统计日期',
      dataIndex: 'staDate',
      type: 'dateMonth',
      search: true,
      hideInTable: true,
      initialValue: moment(),
    },
    {
      title: '采购时间',
      dataIndex: 'purchaseDate',
      type: 'date',
      editable: true,
    },
  ];

  /**
   * 获取当前展示的 dataSource 数据
   * @param dataSource
   */
  const getDataSource = async (dataSource: any[]) => {
    console.log('获取当前展示的数据', dataSource);
    return true;
  };

  /**
   * 监听单行数据变化
   * @param row 单行数据
   */
  const rowOnChange = async (row: any) => {
    console.log('监听单行数据变化', row);
    return true;
  };

  return (
    <EditTable
      columns={columns}
      getByPageService={async () => {
        return Promise.resolve({
          success: true,
          data: {
            rows: [
              {
                id: 1,
                companyName: '公司一',
                companyCde: 'X1',
                purchaseDate: '2023-05-05',
              },
            ],
            total: 1,
          },
        });
      }}
      getDataSource={getDataSource}
      rowOnChange={rowOnChange}
      scroll={{ y: 500 }}
      importExcelService={async () => {}}
      exportExcelService={async () => {}}
    />
  );
};
```
