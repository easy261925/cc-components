import { CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Row, Space, Upload, message } from 'antd';
import { FormInstance } from 'antd/es/form';
import { AxiosResponse } from 'axios';
import { CommonColumnsType, ResponseEntity } from 'easycc-rc-5/entity';
import { handleSearchParams } from 'easycc-rc-5/util/handleParams';
import React, { CSSProperties } from 'react';

export type CommonUtilProps = {
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
  exportExcelService?: (payload: any) => Promise<AxiosResponse>;
  /**
   * 导入接口
   * @param payload 导出参数
   * @returns
   */
  importExcelService?: (payload: any) => Promise<ResponseEntity>;
  /**
   * 获取文件名函数
   * @returns 文件名
   */
  getFileName?: () => string;
  /**
   * 导入按钮属性
   */
  importButtonProps?: ButtonProps;
  /**
   * 导出按钮属性
   */
  exportButtonProps?: ButtonProps;
};

const CommonUtil: React.FC<CommonUtilProps> = (props) => {
  const {
    data,
    searchFormRef,
    columns,
    style,
    exportExcelService,
    importExcelService,
    getFileName,
    importButtonProps = {
      style: { background: '#713ABD', color: '#fff' },
    },
    exportButtonProps = {
      style: { background: '#1DA94D', color: '#fff' },
    },
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
      console.log('导出数据的参数----', payload);
      if (!res) return;
      const fileName = getFileName
        ? getFileName()
        : decodeURI(res.headers['content-disposition']);
      const blobData = res.data;
      const tmpLink = document.createElement('a');
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
        {exportExcelService && (
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
              icon={<CloudUploadOutlined style={{ fontSize: 20 }} />}
              {...importButtonProps}
            >
              导入
            </Button>
          </Upload>
        )}
        {importExcelService && (
          <Button
            key="export"
            type="primary"
            onClick={exportData}
            icon={<DownloadOutlined style={{ fontSize: 20 }} />}
            {...exportButtonProps}
          >
            导出
          </Button>
        )}
      </Space>
    </Row>
  );
};

export default CommonUtil;
