# 可编辑表格 EditTable

可编辑表格

```tsx
import { Form } from 'antd';
import { EditTable } from 'easycc-rc-5';
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
      commonUtilProps={{
        importButtonProps: {
          style: {
            backgroundColor: '#4bba79',
            color: '#fff',
          },
        },
        exportButtonProps: {
          style: {
            backgroundColor: '#ffa940',
            color: '#fff',
          },
        },
      }}
    />
  );
};
```

## API

| 属性               | 描述                                    | 类型                                                                             | 默认值          |
| ------------------ | --------------------------------------- | -------------------------------------------------------------------------------- | --------------- |
| columns            | 表格字段内容                            | `CommonColumnsType<T>[]`                                                         | ---             |
| getByPageService   | 获取数据的分页接口                      | `(params: Partial<object> & PaginationEntity) => Promise<PageResponseEntity<T>>` | ---             |
| getDataSource      | 获取修改后的数据回调                    | `(dataSource: T[]) => Promise<boolean>`                                          | ---             |
| getDataButtonText  | 获取数据按钮文案                        | `string`                                                                         | ---             |
| toolBarRender      | 工具栏                                  | `() => JSX.Element`                                                              | ---             |
| headerRender       | 表格头部渲染                            | `() => JSX.Element`                                                              | ---             |
| enableRefresh      | 是否自动刷新                            | `boolean`                                                                        | `true`          |
| actions            | 自定显示工具栏按钮                      | `boolean`                                                                        | `计算并保存`    |
| rowKey             | rowKey                                  | `keyof T`                                                                        | `id`            |
| data               | 查询参数                                | `Object`                                                                         | ---             |
| pageSize           | 显示行数                                | `number`                                                                         | `MAX_PAGE_SIZE` |
| search             | 是否显示搜索栏                          | `boolean`                                                                        | `true`          |
| rowOnChange        | 监听行数据改变                          | `(row: T) => Promise<boolean>`                                                   | ---             |
| exportExcelService | 导出接口                                | `(payload: any) => Promise<AxiosResponse>`                                       | ---             |
| importExcelService | 导入接口                                | `(payload: any) => Promise<ResponseEntity>`                                      | ---             |
| commonUtilProps    | 工具栏 props                            | `CommonUtilProps`                                                                | ---             |
| actionRef          | EditTable action 的引用，便于自定义触发 | `MutableRefObject<ActionType>`                                                   | ---             |
