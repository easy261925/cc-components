# 图表 CommonChart

CommonChart

```tsx
import { CommonChart } from 'easycc-rc-5';

/**
 * 模拟数据及图表配置
 */
const data = {
  series: {
    type: 'sankey',
    layout: 'none',
    emphasis: {
      focus: 'adjacency',
    },
    data: [
      {
        name: 'a',
      },
      {
        name: 'b',
      },
      {
        name: 'a1',
      },
      {
        name: 'a2',
      },
      {
        name: 'b1',
      },
      {
        name: 'c',
      },
    ],
    links: [
      {
        source: 'a',
        target: 'a1',
        value: 5,
      },
      {
        source: 'a',
        target: 'a2',
        value: 3,
      },
      {
        source: 'b',
        target: 'b1',
        value: 8,
      },
      {
        source: 'a',
        target: 'b1',
        value: 3,
      },
      {
        source: 'b1',
        target: 'a1',
        value: 1,
      },
      {
        source: 'b1',
        target: 'c',
        value: 2,
      },
    ],
  },
};

export default () => {
  /**
   * 获取数据接口
   * @returns
   */
  const fetch = () => {
    const result = {
      success: true,
      data: {
        data,
      },
      message: '访问成功',
    };
    return Promise.resolve(result);
  };

  return (
    <CommonChart
      request={fetch}
      echartsStyle={{
        height: 350,
      }}
      interval={2}
    />
  );
};
```

## API

| 属性            | 描述                  | 类型                                      | 默认值            |
| --------------- | --------------------- | ----------------------------------------- | ----------------- |
| request         | 网络请求接口          | `(params?: T) => Promise<ResponseEntity>` | ---               |
| params          | 网络请求参数          | `T`                                       | ---               |
| interval        | 自动刷新数据 （分钟） | `number`                                  | ---               |
| title           | 标题                  | `string`                                  | ---               |
| backgroundImage | 背景图                | `string`                                  | ---               |
| style           | 自定义样式            | `CSSProperties`                           | ---               |
| echartsStyle    | eCharts 自定义样式    | `CSSProperties`                           | `{ height: 200 }` |
| option          | eCharts option 配置   | `EChartsOption`                           | ---               |
| theme           | eCharts 主题配置      | `string`                                  | ---               |
