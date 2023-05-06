# 通用工具 CommonUtil

通用工具（导入、导出）

```tsx
import { CommonUtil } from 'cc-components';

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

  return <CommonUtil />;
};
```
