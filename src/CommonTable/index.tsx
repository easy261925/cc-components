import { RedoOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
} from 'antd';
import { FormInstance } from 'antd/es/form';
import { AxiosResponse } from 'axios';
import CommonUtil, { CommonUtilProps } from 'easycc-rc-5/CommonUtil';
import {
  ActionType,
  BaseEntity,
  CommonColumnsType,
  FormModeEnum,
  PageResponseEntity,
  PaginationEntity,
  ResponseEntity,
} from 'easycc-rc-5/entity';
import { useDebounceFn } from 'easycc-rc-5/hooks/useDebounceFn';
import SearchBar from 'easycc-rc-5/SearchBar';
import {
  handleParams,
  handleSearchParams,
} from 'easycc-rc-5/util/handleParams';
import React, {
  cloneElement,
  CSSProperties,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface CommonTableProps<T> {
  /**
   * 弹窗标题
   * @default ''
   */
  modalLabel?: string;
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
   * 新增数据接口
   */
  createService?: (params: Partial<T>) => Promise<ResponseEntity>;
  /**
   * 修改数据接口
   */
  updateService?: (params: Partial<T>) => Promise<ResponseEntity>;
  /**
   * 删除数据接口
   */
  deleteService?: (id: string) => Promise<ResponseEntity>;
  /**
   * 弹窗中的表单项数据
   * @default []
   */
  formItems?: JSX.Element[];
  /**
   * 弹窗样式
   */
  modalStyle?: CSSProperties;
  /**
   * 传入的 form 实例
   */
  formInstance: FormInstance;
  /**
   * 查询参数
   */
  data?: any;
  /**
   * table rowKey
   */
  rowKey?: string;
  /**
   * 导出接口
   * @param payload 导出参数
   * @returns
   */
  exportExcelService?: (payload: any) => Promise<AxiosResponse>;
  /**
   * 导入接口
   * @param payload 导出参数
   * @returns
   */
  importExcelService?: (payload: any) => Promise<ResponseEntity>;
  /**
   * 工具栏属性
   */
  commonUtilProps?: CommonUtilProps;
  /**
   * 是否显示搜索项
   */
  search?: boolean;
  /**
   * CommonTable action 的引用，便于自定义触发
   */
  actionRef?: React.Ref<ActionType | undefined>;
}

function CommonTable<T extends BaseEntity>(props: CommonTableProps<T>) {
  const {
    modalLabel = '',
    columns,
    getByPageService,
    createService,
    updateService,
    deleteService,
    formItems,
    modalStyle = {},
    formInstance,
    data,
    rowKey = 'id',
    exportExcelService,
    importExcelService,
    commonUtilProps,
    search = true,
    actionRef: propsActionRef,
    ...ext
  } = props;
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [formMode, setFormMode] = useState(FormModeEnum.CREATE);
  const [tableColumns, setTableColumns] = useState<CommonColumnsType<T>[]>(
    columns?.filter((item) => !item.hideInTable) || [],
  );
  const [searchFormRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  /** 通用的来操作子节点的工具类 */
  const actionRef = useRef<ActionType>();

  if (propsActionRef) {
    // @ts-ignore
    propsActionRef.current = actionRef.current;
  }

  // 获取分页数据
  const getDataByPage = async (params?: Partial<object & PaginationEntity>) => {
    if (getByPageService) {
      setLoading(true);
      const searcher = searchFormRef.getFieldsValue();
      const newSearcher = handleSearchParams(searcher, columns);
      const payload = {
        ...params,
        current: params?.current || current,
        pageSize: 10,
        ...newSearcher,
        ...data,
      };
      getByPageService(payload)
        .then((res) => {
          if (res.success) {
            setDataSource(res.data.rows);
            setTotal(res.data.total);
            setCurrent(params?.current || current);
          }
        })
        .finally(() => {
          setLoading(false);
        });
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  };

  useImperativeHandle(propsActionRef, () => {
    return {
      reload: getDataByPage,
    };
  });

  /**
   * 初始化请求防抖
   */
  const fetchData = useDebounceFn(getDataByPage, 100);

  useEffect(() => {
    fetchData.run(true);
  }, [data]);

  useEffect(() => {
    const optionColumn: CommonColumnsType<T> = {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (text: string, entity: T) => (
        <Space>
          <a
            onClick={() => {
              setFormMode(FormModeEnum.VIEW);
              const params = handleParams(entity, columns);
              formInstance?.setFieldsValue(params);
              setOpen(true);
            }}
          >
            查看
          </a>
          {updateService && (
            <a
              onClick={() => {
                setFormMode(FormModeEnum.UPDATE);
                const params = handleParams(entity, columns);
                formInstance?.setFieldsValue(params);
                setOpen(true);
              }}
            >
              修改
            </a>
          )}
          {deleteService && (
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                deleteService(entity.id).then((res) => {
                  if (res.success) {
                    getDataByPage();
                    message.success('删除成功');
                  } else {
                    message.error('删除失败');
                  }
                });
              }}
            >
              <a>删除</a>
            </Popconfirm>
          )}
        </Space>
      ),
    };
    if (
      columns &&
      columns.length > 0 &&
      !columns.find((column) => column.dataIndex === 'option')
    ) {
      setTableColumns(
        columns.filter((item) => !item.hideInTable).concat(optionColumn),
      );
    }
  }, [columns]);

  // 取消弹窗
  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false);
  };

  // 提交表单（新增或修改）
  const onOK = () => {
    formInstance?.validateFields().then((values) => {
      const newValues = handleSearchParams(values, columns);
      if (formMode === FormModeEnum.CREATE) {
        // 新增
        if (!createService) return;
        setLoading(true);
        createService(newValues)
          .then((res) => {
            if (res.success) {
              message.success('添加成功');
              getDataByPage();
            } else {
              message.error('添加失败');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // 修改
        if (!updateService) return;
        setLoading(true);
        updateService(newValues)
          .then((res) => {
            if (res.success) {
              message.success('修改成功');
              getDataByPage();
            } else {
              message.error('修改失败');
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
      formInstance.resetFields();
      setOpen(false);
    });
  };

  /**
   * 弹窗标题
   */
  let title = `查看${modalLabel}`;
  if (formMode === FormModeEnum.CREATE) {
    title = `新建${modalLabel}`;
  } else if (formMode === FormModeEnum.UPDATE) {
    title = `修改${modalLabel}`;
  }

  return (
    <div className="flex-col">
      {search && (
        <SearchBar
          columns={columns}
          getDataByPage={getDataByPage}
          formInstance={searchFormRef}
        />
      )}
      <Row justify="end" style={{ margin: '10px 0' }}>
        <Space>
          <CommonUtil
            searchFormRef={searchFormRef}
            columns={columns}
            exportExcelService={exportExcelService}
            importExcelService={importExcelService}
            {...commonUtilProps}
          />
          {createService && (
            <Button
              key="create"
              type="primary"
              onClick={() => {
                setFormMode(FormModeEnum.CREATE);
                setOpen(true);
                formInstance?.resetFields();
              }}
            >
              新增
            </Button>
          )}
          {getByPageService && (
            <Button
              key="reload"
              icon={<RedoOutlined />}
              onClick={() => getDataByPage({ current: 1 })}
            ></Button>
          )}
        </Space>
      </Row>
      <Spin spinning={loading}>
        <Table<T>
          rowKey={rowKey}
          columns={tableColumns}
          dataSource={dataSource}
          size="small"
          pagination={{
            size: 'small',
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
      <Modal
        open={open}
        destroyOnClose
        onCancel={onCancel}
        title={title}
        getContainer={false}
        footer={
          <Row justify="end">
            {formMode === FormModeEnum.VIEW ? (
              <Button onClick={onCancel}>关闭</Button>
            ) : (
              <Space>
                <Button onClick={onCancel}>关闭</Button>
                <Button type="primary" onClick={onOK} loading={loading}>
                  确定
                </Button>
              </Space>
            )}
          </Row>
        }
        style={modalStyle}
      >
        <Spin spinning={loading}>
          <Form form={formInstance}>
            {formItems?.map((item) => {
              return cloneElement(item, {
                ...item.props,
                children: cloneElement(item.props.children, {
                  style: { width: '100%' },
                  disabled: formMode === FormModeEnum.VIEW,
                  ...item.props.children.props,
                }),
              });
            })}
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default CommonTable;
