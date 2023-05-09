import { SwitchProps } from 'antd';
import { ColumnType } from 'antd/lib/table';
import type { Moment } from 'moment';

export type PaginationEntity = {
  current: number;
  pageSize: number;
};

export enum FormModeEnum {
  'CREATE',
  'UPDATE',
  'VIEW',
}

export type ResponseEntity<T = any> = {
  success: boolean;
  data: T;
  message: string;
};

export type PageResponseEntity<T> = {
  data: {
    rows: T[];
    total: number;
  };
  success: boolean;
  message: string;
};

export interface CommonColumnsType<T> extends ColumnType<T> {
  search?: boolean;
  title?: string;
  dataIndex: string;
  type?:
    | 'text'
    | 'select'
    | 'date'
    | 'number'
    | 'dateMonth'
    | 'dateYear'
    | 'switch';
  switchProps?: SwitchProps;
  formItem?: JSX.Element;
  placeholder?: string;
  options?: OptionEntity[];
  editable?: boolean;
  required?: boolean;
  hideInTable?: boolean;
  initialValue?: string | number | Array<string> | Array<number> | Moment;
  allowClear?: boolean;
}

export type OptionEntity = {
  label: string;
  value: string;
};

export type SearcherEntity = {
  [key: string]: string;
};

export type FileExportEntity = {
  file?: File;
  [key: string]: any;
};
