import { CommonColumnsType, SearcherEntity } from 'easycc-rc-5/entity';
import moment from 'moment';

/**
 * 处理搜索发送参数，Moment 对象转为 字符串
 * @param searcher 查询参数
 * @param columns Table 列描述
 * @returns 处理结果
 */
export function handleSearchParams<T>(
  searcher: SearcherEntity,
  columns?: CommonColumnsType<T>[],
): any {
  const newSearch: SearcherEntity = {};
  // 处理 moment 类型的时间数据
  for (const key in searcher) {
    if (Object.prototype.hasOwnProperty.call(searcher, key)) {
      const element = searcher[key];
      if (moment.isMoment(element) && columns) {
        if (
          columns?.find((col) => col.dataIndex === key)?.type === 'dateMonth'
        ) {
          newSearch[key] = moment(element).format('YYYY-MM');
        } else if (
          columns?.find((col) => col.dataIndex === key)?.type === 'dateYear'
        ) {
          newSearch[key] = moment(element).format('YYYY');
        } else {
          newSearch[key] = moment(element).format('YYYY-MM-DD');
        }
      } else {
        newSearch[key] = element;
      }
    }
  }
  return newSearch;
}

/**
 * 处理数据，时间格式转换 字符串转换为 Moment
 * @param params 需要转换的参数
 * @param columns Table 列描述
 * @returns 处理结果
 */
export function handleParams<T>(params: T, columns?: CommonColumnsType<T>[]) {
  const newSearch: Record<string, unknown> = {};
  // 处理 moment 类型的时间数据
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      if (
        columns?.find((col) => col.dataIndex === key)?.type === 'dateMonth' ||
        columns?.find((col) => col.dataIndex === key)?.type === 'date' ||
        columns?.find((col) => col.dataIndex === key)?.type === 'dateYear'
      ) {
        newSearch[key] = moment(element as string);
      } else {
        newSearch[key] = element;
      }
    }
  }
  return newSearch;
}
