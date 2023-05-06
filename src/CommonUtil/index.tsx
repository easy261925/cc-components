import { CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Row, Space, Upload, message } from 'antd';
import { FormInstance } from 'antd/es/form';
import { CommonColumnsType, ResponseEntity } from 'cc-ui/types';
import { handleSearchParams } from 'cc-ui/util/handleParams';
import React, { CSSProperties } from 'react';

type CommonUtilProps = {
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
   * 附带参数
   */
  data?: any;
  /**
   * Form 实例
   */
  searchFormRef?: FormInstance;
  /**
   * 表格字段内容
   * @default []
   */
  columns?: CommonColumnsType<any>[];
  /**
   * 自定义样式
   */
  style?: CSSProperties;
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
};

const CommonUtil: React.FC<CommonUtilProps> = (props) => {
  const {
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
        key: 'reload',
        hide: false,
      },
    ],
    data,
    searchFormRef,
    columns,
    style,
    exportExcelService,
    importExcelService,
  } = props;

  /**
   * 导出数据
   */
  const exportData = () => {
    if (!exportExcelService) {
      return;
    }
    let newSearch = {};
    if (searchFormRef && columns) {
      const searcher = searchFormRef.getFieldsValue();
      newSearch = handleSearchParams(searcher, columns);
    }
    const payload = {
      ...newSearch,
      ...data,
    };
    console.log('导出数据的参数', payload);
    exportExcelService(payload).then((res) => {
      if (!res) return;
      const fileInfo = {
        blobData: res,
        fileName: decodeURI(res.type),
      };
      const tmpLink = document.createElement('a');
      const { blobData, fileName } = fileInfo;
      const blob = new Blob([blobData]);
      const objectUrl = URL.createObjectURL(blob);
      tmpLink.href = objectUrl;
      tmpLink.download = fileName;
      document.body.appendChild(tmpLink);
      tmpLink.click();
      URL.revokeObjectURL(objectUrl);
    });
  };

  return (
    <Row className="m-2" justify="end" style={style}>
      <Space>
        {actions &&
          !actions.find((action) => action.key === 'import')?.hide && (
            <Upload
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              beforeUpload={async (file) => {
                let newSearch = {};
                if (searchFormRef && columns) {
                  const searcher = searchFormRef.getFieldsValue();
                  newSearch = handleSearchParams(searcher, columns);
                }
                const payload = {
                  file,
                  ...newSearch,
                  ...data,
                };
                if (importExcelService) {
                  const res = await importExcelService(payload);
                  if (res.success) {
                    message.success('导入成功');
                  } else {
                    message.error('导入失败');
                  }
                  return res.success;
                }
              }}
              showUploadList={false}
            >
              <Button
                style={{ background: '#713ABD', color: '#fff' }}
                icon={<CloudUploadOutlined style={{ fontSize: 20 }} />}
              >
                导入
              </Button>
            </Upload>
          )}
        {actions &&
          !actions.find((action) => action.key === 'export')?.hide && (
            <Button
              key="export"
              type="primary"
              onClick={exportData}
              style={{ background: '#1DA94D', color: '#fff' }}
              icon={<DownloadOutlined style={{ fontSize: 20 }} />}
            >
              导出
            </Button>
          )}
      </Space>
    </Row>
  );
};

export default CommonUtil;
