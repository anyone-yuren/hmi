interface Result<T = any> {
  floor_list?: never[];
  message?: string;
  data: T;
  result?: T;
  code?: number;
  resultData?: T;
  statusCode?: number;
}
