# 表格 CommonTable

表格

```tsx
import { DatePicker, Form, Input } from 'antd';
import { CommonTable } from 'cc-components';
import moment from 'moment';

export default () => {
  const [form] = Form.useForm();

  const columns: CommonColumnsType<CarbonFacilityEntity>[] = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      search: true,
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
    },
  ];

  const formItems = [
    <Form.Item key="id" name="id" noStyle>
      <Input type="hidden" />
    </Form.Item>,
    <Form.Item key="companyName" label="公司名称" name="companyName">
      <Input placeholder="请输入公司名称" />
    </Form.Item>,
    <Form.Item key="companyCde" label="公司编码" name="companyCde">
      <Input placeholder="请输入公司编码" />
    </Form.Item>,
    <Form.Item
      label="采购时间"
      key="purchaseDate"
      name="purchaseDate"
      rules={[{ required: true, message: '请选择采购时间' }]}
    >
      <DatePicker placeholder="请选择采购时间" />
    </Form.Item>,
  ];

  return (
    <CommonTable
      columns={columns}
      formItems={formItems}
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
      createService={async (payload) => {
        console.log('新增的数据', payload);
        return Promise.resolve({
          success: true,
        });
      }}
      updateService={async (payload) => {
        console.log('修改的数据', payload);
        return Promise.resolve({
          success: true,
        });
      }}
      deleteService={async (id) => {
        console.log('删除的id', id);
        return Promise.resolve({
          success: true,
        });
      }}
      modalLabel="项目管理"
      formInstance={form}
      importExcelService={async () => {}}
      exportExcelService={async () => {}}
    />
  );
};
```
