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
