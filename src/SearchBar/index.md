# 搜索栏 SearchBar

通用搜索栏

```tsx
import { Form } from 'antd';
import { SearchBar } from 'easycc-rc-5';
import { CommonColumnsType, SearcherEntity } from 'easycc-rc-5/entity';
import moment from 'moment';

export default () => {
  const [searchForm] = Form.useForm();

  /**
   * 获取搜索项内容
   * @param searcher 搜索项的值
   */
  const searchOnChange = (searcher?: SearcherEntity) => {
    console.log('搜索项的值', searcher);
  };

  /**
   * 搜索项配置
   */
  const searchColumns: CommonColumnsType<CompanyCarbonComputeEntity>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      type: 'dateMonth',
      search: true,
      initialValue: moment().format('YYYY-MM'),
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      type: 'dateMonth',
      search: true,
      initialValue: moment().format('YYYY-MM'),
    },
    {
      title: '选择模式',
      dataIndex: 'mode',
      initialValue: '1',
      type: 'select',
      options: [
        {
          label: '模式一',
          value: '1',
        },
        {
          label: '模式二',
          value: '0',
        },
      ],
      search: true,
    },
  ];

  return (
    <SearchBar
      columns={searchColumns}
      formInstance={searchForm}
      onChange={searchOnChange}
    />
  );
};
```

## API

| 属性          | 描述               | 类型                                                    | 默认值 |
| ------------- | ------------------ | ------------------------------------------------------- | ------ |
| columns       | 搜索项内容         | `CommonColumnsType<T>[]`                                | ---    |
| getDataByPage | 查询数据函数       | `(params?: Partial<object & PaginationEntity>) => void` | ---    |
| formInstance  | form 实例          | `FormInstance`                                          | ---    |
| onChange      | 获取改变的搜索项值 | `(searcher: SearcherEntity) => void;`                   | ---    |
| style         | 自定义样式         | `CSSProperties`                                         | ---    |
| colSpan       | 每个搜索框占格     | `number`                                                | `6`    |
