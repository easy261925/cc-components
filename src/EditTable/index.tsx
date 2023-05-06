import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  InputRef,
  Row,
  Space,
  Spin,
  Switch,
  Table,
} from 'antd';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import { TableProps } from 'antd/es/table';
import { CommonUtil } from 'cc-ui';
import SearchBar from 'cc-ui/SearchBar';
import { useDebounceFn } from 'cc-ui/hooks/useDebounceFn';
import {
  BaseEntity,
  CommonColumnsType,
  PageResponseEntity,
  PaginationEntity,
  ResponseEntity,
} from 'cc-ui/types';
import { MAX_PAGE_SIZE } from 'cc-ui/util/constants';
import { handleSearchParams } from 'cc-ui/util/handleParams';
import moment, { Moment } from 'moment';

const EditableContext = createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps<T> {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof T;
  record: T;
  type: CommonColumnsType<T>['type'];
  required: CommonColumnsType<T>['required'];
  handleSave: (record: T) => void;
  columns?: CommonColumnsType<T>[];
}

function EditableCell<T extends BaseEntity>(props: EditableCellProps<T>) {
  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    type,
    required,
    columns = [],
    ...restProps
  } = props;

  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const inputNumberRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<any>(null);
  const dateMonthPickerRef = useRef<any>(null);
  const dateYearPickerRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      switch (type) {
        case 'number':
          inputNumberRef.current!.focus();
          break;
        case 'date':
          datePickerRef.current!.focus();
          break;
        case 'dateMonth':
          dateMonthPickerRef.current!.focus();
          break;
        case 'dateYear':
          dateYearPickerRef.current!.focus();
          break;
        default:
          inputRef.current!.focus();
          break;
      }
    }
  }, [editing, type]);

  const toggleEdit = () => {
    setEditing(!editing);
    let newValue: string | number | boolean | Moment | null | undefined =
      record[dataIndex] as never;
    if (type === 'dateMonth' || type === 'date' || type === 'dateYear') {
      newValue = record[dataIndex] ? moment(record[dataIndex] as string) : null;
    }
    form.setFieldsValue({ [dataIndex]: newValue });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      const newValues = handleSearchParams(values, columns);
      const newRow = { ...record, ...newValues };
      if (type !== 'switch') {
        toggleEdit();
      }
      handleSave(newRow);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (editing) {
      switch (type) {
        case 'number':
          childNode = (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex as string}
              rules={[
                {
                  required,
                  message: `请填写${title}`,
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                precision={4}
                ref={inputNumberRef}
                onPressEnter={save}
                onBlur={save}
              />
            </Form.Item>
          );
          break;
        case 'date':
          childNode = (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex as string}
              rules={[
                {
                  required,
                  message: `请选择${title}`,
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                ref={datePickerRef}
                onOk={save}
                onBlur={save}
              />
            </Form.Item>
          );
          break;
        case 'dateMonth':
          childNode = (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex as string}
              rules={[
                {
                  required,
                  message: `请选择${title}`,
                },
              ]}
            >
              <DatePicker.MonthPicker
                style={{ width: '100%' }}
                ref={dateMonthPickerRef}
                onOk={save}
                onBlur={save}
              />
            </Form.Item>
          );
          break;
        case 'dateYear':
          childNode = (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex as string}
              rules={[
                {
                  required,
                  message: `请选择${title}`,
                },
              ]}
            >
              <DatePicker.YearPicker
                style={{ width: '100%' }}
                ref={dateYearPickerRef}
                onOk={save}
                onBlur={save}
              />
            </Form.Item>
          );
          break;
        default:
          childNode = (
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex as string}
              rules={[
                {
                  required,
                  message: `请填写${title}`,
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                ref={inputRef}
                onPressEnter={save}
                onBlur={save}
              />
            </Form.Item>
          );
          break;
      }
    } else if (type === 'switch') {
      const switchProps = columns.find(
        (col) => col.dataIndex === dataIndex,
      )?.switchProps;
      childNode = (
        <div
          className="flex items-center"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          {
            <Form.Item
              style={{ margin: 0 }}
              name={dataIndex as string}
              valuePropName="checked"
              initialValue={record[dataIndex]}
            >
              <Switch
                {...switchProps}
                style={{ width: '100%' }}
                onChange={save}
              />
            </Form.Item>
          }
        </div>
      );
    } else {
      childNode = (
        <div
          className="flex items-center"
          style={{ paddingRight: 24, minHeight: 22 }}
          onClick={toggleEdit}
        >
          {children}
          {editable && (
            <FormOutlined style={{ fontSize: 12, marginLeft: 10 }} />
          )}
        </div>
      );
    }
  }
  return <td {...restProps}>{childNode}</td>;
}

interface EditTableProps<T> {
  /**
   * 表格字段内容
   * @default []
   */
  columns?: CommonColumnsType<T>[];
  /**
   * 获取数据的分页接口
   */
  getByPageService?: (
    params: Partial<object> & PaginationEntity,
  ) => Promise<PageResponseEntity<T>>;
  /**
   * 搜索项
   * @default []
   */
  formItems?: JSX.Element[];
  /**
   * 获取修改后的数据回调
   */
  getDataSource?: (dataSource: T[]) => Promise<boolean>;
  /**
   * 获取数据按钮文案
   */
  getDataButtonText?: string;
  /**
   * 工具栏按钮
   * @returns
   */
  toolBarRender?: () => JSX.Element;
  /**
   * 表格头部渲染
   * @returns
   */
  headerRender?: () => JSX.Element;
  /**
   * 是否自动刷新,默认 true
   */
  enableRefresh?: boolean;
  /**
   * 自定显示工具栏按钮,设置 false 即可隐藏,默认展示全部
   */
  actions?:
    | [
        {
          key: 'import';
          hide: boolean;
        },
        {
          key: 'export';
          hide: boolean;
        },
        {
          key: 'calculate';
          hide: boolean;
        },
        {
          key: 'reload';
          hide: boolean;
        },
      ]
    | false;
  /**
   * table rowKey
   */
  rowKey?: keyof T;
  /**
   * 查询参数
   */
  data?: any;
  /**
   * Table 显示行数
   */
  pageSize?: number;
  /**
   * 是否显示搜索栏
   */
  search?: boolean;
  /**
   * 监听行数据改变
   */
  rowOnChange?: (row: T) => Promise<boolean>;
  /**
   * 导出接口
   * @param payload 导出参数
   * @returns
   */
  exportExcelService?: (payload: any) => Promise<Blob>;
  /**
   * 导入接口
   * @param payload 导出参数
   * @returns
   */
  importExcelService?: (payload: any) => Promise<ResponseEntity>;
}

function EditTable<T extends BaseEntity>(
  props: EditTableProps<T> & TableProps<T>,
) {
  const {
    columns = [],
    getByPageService,
    getDataSource,
    getDataButtonText = '计算并保存',
    toolBarRender,
    headerRender = () => <div></div>,
    enableRefresh = true,
    actions = [
      {
        key: 'import',
        hide: false,
      },
      {
        key: 'export',
        hide: false,
      },
      {
        key: 'calculate',
        hide: false,
      },
      {
        key: 'reload',
        hide: false,
      },
    ],
    rowKey = 'id',
    data,
    pageSize = MAX_PAGE_SIZE,
    search = true,
    rowOnChange,
    exportExcelService,
    importExcelService,
    ...ext
  } = props;
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchFormRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const components = {
    body: {
      row: EditableRow,
      cell: (props: EditTableProps<T>) =>
        EditableCell({ ...props, columns } as unknown as EditableCellProps<T>),
    },
  };

  // 获取分页数据
  const getDataByPage = async (params?: Partial<object & PaginationEntity>) => {
    const searcher = searchFormRef.getFieldsValue();
    const newSearch = handleSearchParams(searcher, columns);
    setLoading(true);
    const payload = {
      ...newSearch,
      ...params,
      current: params?.current || current,
      pageSize,
      ...data,
    };
    if (getByPageService) {
      getByPageService(payload)
        .then((res) => {
          setLoading(false);
          if (res.success) {
            setDataSource(res.data.rows);
            setTotal(res.data.total);
            setCurrent(params?.current || current);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return Promise.resolve(true);
  };

  /**
   * 初始化请求防抖
   */
  const fetchData = useDebounceFn(getDataByPage, 100);

  useEffect(() => {
    fetchData.run(true);
  }, [data]);

  /**
   * 保存数据
   * @param row
   */
  const handleSave = (row: T) => {
    const newData = [...dataSource];
    const key: keyof T = rowKey;
    const index = newData.findIndex((item) => row[key] === item[key]);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if (rowOnChange) {
      rowOnChange(row).then(
        (result) => enableRefresh && result && getDataByPage(),
      );
    }
    setDataSource(newData);
  };

  return (
    <div className="flex-col">
      {search && (
        <SearchBar
          columns={columns}
          getDataByPage={getDataByPage}
          formInstance={searchFormRef}
        />
      )}
      <Row className="m-2" justify="space-between" align="middle">
        {headerRender && headerRender()}
        {
          <Space>
            {toolBarRender && toolBarRender()}
            <CommonUtil
              searchFormRef={searchFormRef}
              columns={columns}
              actions={actions}
              exportExcelService={exportExcelService}
              importExcelService={importExcelService}
            />
            {actions &&
              !actions.find((action) => action.key === 'calculate')?.hide && (
                <Button
                  key="calculate"
                  type="primary"
                  onClick={() => {
                    if (getDataSource) {
                      getDataSource(dataSource).then(
                        (result) => enableRefresh && result && getDataByPage(),
                      );
                    }
                  }}
                  loading={loading}
                >
                  {getDataButtonText}
                </Button>
              )}
            {actions &&
              !actions.find((action) => action.key === 'reload')?.hide && (
                <Button
                  key="reload"
                  icon={<RedoOutlined />}
                  onClick={() => getDataByPage({ current: 1 })}
                ></Button>
              )}
          </Space>
        }
      </Row>
      <Spin spinning={loading}>
        <Table
          rowKey={rowKey}
          components={components}
          size="small"
          dataSource={dataSource}
          bordered
          columns={columns
            .filter((item) => !item.hideInTable)
            .map((col) => {
              if (!col.editable) {
                return col;
              }
              return {
                ...col,
                onCell: (record: T) => ({
                  record,
                  type: col.type,
                  required: col.required,
                  editable: col.editable,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  handleSave,
                }),
              };
            })}
          pagination={{
            size: 'small',
            hideOnSinglePage: true,
            pageSize,
            total,
            current,
          }}
          onChange={(params) => {
            getDataByPage({ current: params.current });
            setCurrent(params.current || 1);
          }}
          {...ext}
        />
      </Spin>
    </div>
  );
}

export default EditTable;
