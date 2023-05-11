# 通用工具 CommonUtil

通用工具（导入、导出）

```tsx
import axios from 'axios';
import { CommonUtil } from 'easycc-rc-5';

export default () => {
  /**
   * 导出 excel 接口
   * @param params
   * @returns
   */
  const exportExcelService = async (payload: any) => {
    return axios.post(`/api/xxx/exportExcel`, payload, {
      responseType: 'blob',
    });
  };

  /**
   * 导入 excel 接口
   * @param params
   * @returns
   */
  const importExcelService = async (payload: any) => {
    const params = new FormData();
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        const item = payload[key] || '';
        params.append([key] as unknown as string, item);
      }
    }
    return axios.post(`/api/xxx/importExcel`, params);
  };

  return (
    <CommonUtil
      exportExcelService={exportExcelService}
      importExcelService={importExcelService}
    />
  );
};
```

## API

| 属性               | 描述         | 类型                                        | 默认值 |
| ------------------ | ------------ | ------------------------------------------- | ------ |
| data               | 附带参数     | `Object`                                    | ---    |
| searchFormRef      | form 实例    | `FormInstance`                              | ---    |
| columns?           | 表格字段内容 | `CommonColumnsType<T>[]`                    | ---    |
| style              | 自定义样式   | `CSSProperties`                             | ---    |
| exportExcelService | 导出接口     | `(payload: any) => Promise<Blob>`           | ---    |
| importExcelService | 导入接口     | `(payload: any) => Promise<ResponseEntity>` | ---    |
