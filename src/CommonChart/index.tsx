import { Spin } from 'antd';
import { ResponseEntity } from 'cc-ui/types';
import ReactEcharts, { EChartsOption } from 'echarts-for-react';
import type { CSSProperties } from 'react';
import React, { useEffect, useRef, useState } from 'react';

type CommonChartProps<T> = {
  /**
   * @params 数据请求接口
   * */
  request?: (params?: T) => Promise<ResponseEntity>;
  /**
   * @params 请求参数
   * */
  params?: T;
  /**
   * @params  图表配置
   * */
  option?: EChartsOption;

  /**
   * @params 自动刷新数据 （分钟）
   * */
  interval?: number;
  /**
   * @params 图表主题
   * */
  theme?: string;
  /**
   * @params 标题
   * */
  title?: JSX.Element | string;
  /**
   * @params 背景图
   * */
  backgroundImage?: string;
  /** @params
   * 自定义样式
   *  */
  style?: CSSProperties;
  /**
   * @params 图表样式
   *  */
  echartsStyle?: CSSProperties;
};

/**
 * 根据 params 动态加载数据
 * @param props
 * @returns
 */

function CommonChart<T>(props: CommonChartProps<T>) {
  const {
    params,
    request,
    echartsStyle = { height: 200 },
    interval,
    title,
    theme,
    backgroundImage,
    style,
  } = props;
  const [option, setOption] = useState(props.option);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timer | null>();

  const fetchOption = async (payload?: T) => {
    if (!request) return;
    return request(payload).then((res) => {
      if (res.success) {
        setOption(res.data.data);
      }
    });
  };

  const init = async () => {
    if (!request) {
      return;
    }
    if (timerRef && timerRef.current) {
      clearInterval(timerRef.current);
    }
    setLoading(true);
    await fetchOption(params);
    setLoading(false);
    if (interval) {
      timerRef.current = setInterval(() => {
        fetchOption(params);
      }, interval * 1000);
    }
  };

  useEffect(() => {
    init();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [params]);

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spin />
      </div>
    );
  }

  return (
    <div
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: '100% 100%',
              position: 'relative',
              zIndex: 99,
              height: '100%',
              width: '100%',
              ...style,
            }
          : {
              height: '100%',
              width: '100%',
              ...style,
            }
      }
    >
      {title}
      {option && (
        <ReactEcharts
          style={echartsStyle}
          option={option}
          notMerge={true}
          theme={theme}
        />
      )}
    </div>
  );
}
export default CommonChart;
