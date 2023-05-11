import { DownOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
} from 'antd';
import { FormInstance } from 'antd/es/form';
import {
  BaseEntity,
  CommonColumnsType,
  PaginationEntity,
  SearcherEntity,
} from 'easycc-rc-5/entity';
import { handleSearchParams } from 'easycc-rc-5/util/handleParams';
import moment from 'moment';
import React, { CSSProperties, useState } from 'react';
import '../index.less';

interface SearchBarProps<T> {
  /**
   * 搜索项内容
   * @default []
   */
  columns?: CommonColumnsType<T>[];
  /**
   * 查询数据函数
   */
  getDataByPage?: (params?: Partial<object & PaginationEntity>) => void;
  /**
   * form 实例
   */
  formInstance: FormInstance;
  /**
   * 获取改变的搜索项值
   */
  onChange?: (searcher: SearcherEntity) => void;
  /**
   * 自定义样式
   */
  style?: CSSProperties;
  /**
   * 每个搜索框占格
   */
  colSpan?: number;
}

function SearchBar<T extends BaseEntity>(props: SearchBarProps<T>) {
  const {
    columns,
    getDataByPage,
    formInstance,
    onChange,
    style,
    colSpan = 6,
  } = props;
  const [collapsed, setCollapsed] = useState(true);

  /**
   * 渲染搜索项中的查询、重置按钮
   * @param collapsed 是否折叠
   * @returns
   */
  const collapseRender = (collapsed: boolean) => {
    if (collapsed) {
      return (
        <a className="flex items-center">
          <span>展开</span>
          <DownOutlined
            style={{
              marginInlineStart: '0.5em',
              transition: '0.3s all',
              transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
            }}
          />
        </a>
      );
    }
    return (
      <a className="flex items-center">
        <span>收起</span>
        <DownOutlined
          style={{
            marginInlineStart: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
          }}
        />
      </a>
    );
  };

  /**
   * 渲染搜索项
   * @param collapsed 是否折叠
   * @returns
   */
  const renderSearchForm = (collapsed: boolean) => {
    const allOptions = columns?.filter((column) => column.search) || [];
    let showOptions: CommonColumnsType<T>[] = [];
    const allLength = allOptions.length;
    if (allOptions.length === 0) {
      return null;
    }
    const oneLineOptionLength = 4;
    let needCollapseRender = true;
    if (allLength >= oneLineOptionLength) {
      if (collapsed) {
        showOptions = allOptions.slice(0, oneLineOptionLength - 1);
      } else {
        showOptions = allOptions;
      }
    } else {
      showOptions = allOptions;
      needCollapseRender = false;
    }

    // 重置搜索项
    const onReset = () => {
      formInstance?.resetFields();
      const searcher = formInstance?.getFieldsValue();
      const newSearch = handleSearchParams(searcher, columns);
      if (onChange) {
        onChange(newSearch);
      }
      if (getDataByPage) {
        getDataByPage();
      }
    };

    // 点击查询按钮
    const onSearch = (params = {}) => {
      const searcher = formInstance?.getFieldsValue();
      const newSearch = handleSearchParams(searcher, columns);
      if (onChange) {
        onChange(newSearch);
      }
      if (getDataByPage) {
        getDataByPage({
          ...newSearch,
          current: 1,
          pageSize: 10,
          ...params,
        });
      }
    };

    return (
      <Card bodyStyle={{ padding: '10px 24px' }} style={style}>
        <Form
          form={formInstance}
          layout="inline"
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 24 },
            md: { span: 24 },
            lg: { span: 24 },
            xl: { span: 24 },
            xxl: { span: 12 },
          }}
        >
          {allOptions.map((item) => {
            const show = showOptions.find(
              (option) => option.dataIndex === item.dataIndex,
            );
            let formItem: JSX.Element | null = item.formItem || null;
            let initialValue = item.initialValue;
            switch (item.type) {
              case 'select':
                formItem = (
                  <Select
                    placeholder={item.placeholder || `请选择${item.title}`}
                    allowClear={item.allowClear}
                    onChange={(val) => {
                      onSearch({ [item.dataIndex]: val });
                    }}
                  >
                    {item?.options?.map((option) => (
                      <Select.Option value={option.value} key={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                );
                break;
              case 'date':
                if (initialValue && !moment.isMoment(initialValue)) {
                  initialValue = moment(item.initialValue);
                }
                formItem = (
                  <DatePicker
                    onChange={(val) => {
                      onSearch({
                        [item.dataIndex]: moment(val).format('YYYY-MM-dd'),
                      });
                    }}
                    allowClear={false}
                    className="w-full"
                    placeholder={item.placeholder || `请选择${item.title}`}
                  />
                );
                break;
              case 'dateMonth':
                if (initialValue && !moment.isMoment(initialValue)) {
                  initialValue = moment(item.initialValue);
                }
                formItem = (
                  <DatePicker.MonthPicker
                    onChange={(val) => {
                      onSearch({
                        [item.dataIndex]: moment(val).format('YYYY-MM'),
                      });
                    }}
                    allowClear={false}
                    className="w-full"
                    placeholder={item.placeholder || `请选择${item.title}`}
                  />
                );
                break;
              case 'dateYear':
                if (initialValue && !moment.isMoment(initialValue)) {
                  initialValue = moment(item.initialValue);
                }
                formItem = (
                  <DatePicker.YearPicker
                    onChange={(val) => {
                      onSearch({
                        [item.dataIndex]: moment(val).format('YYYY'),
                      });
                    }}
                    allowClear={false}
                    className="w-full"
                    placeholder={item.placeholder || `请选择${item.title}`}
                  />
                );
                break;
              default:
                formItem = (
                  <Input
                    placeholder={item.placeholder || `请输入${item.title}`}
                    allowClear
                  />
                );
                break;
            }

            return (
              <Col span={show ? colSpan : 0} key={item.dataIndex}>
                <Form.Item
                  label={item.title}
                  name={item.dataIndex}
                  style={{
                    marginBottom: 6,
                    marginTop: 6,
                  }}
                  initialValue={initialValue}
                >
                  {formItem}
                </Form.Item>
              </Col>
            );
          })}
          <Col
            span={0}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flex: 1,
              marginRight: 16,
              marginBottom: 6,
              marginTop: 6,
            }}
          >
            <Space>
              <Button type="primary" onClick={() => onSearch()}>
                查询
              </Button>
              <Button onClick={onReset}>重置</Button>
              {needCollapseRender && (
                <div onClick={() => setCollapsed(!collapsed)}>
                  {collapseRender(collapsed)}
                </div>
              )}
            </Space>
          </Col>
        </Form>
      </Card>
    );
  };

  return <div>{renderSearchForm(collapsed)}</div>;
}

export default SearchBar;
