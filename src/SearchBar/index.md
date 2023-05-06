# 搜索栏 SearchBar

通用搜索栏

```tsx
import { SearchBar } from 'cc-components';
import {
  BaseEntity,
  CommonColumnsType,
  PaginationEntity,
  SearcherEntity,
} from 'cc-components/types';
import moment from 'moment';
import { Form } from 'antd';

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
