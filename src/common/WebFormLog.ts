export interface WebFormLogDetail {
  from: string;
  to: string;
  reason: string;
  processTime: number;
  rqUid: string;
  rsUid: string;
  remark: string;
  status: string;
  seq?: number;
}

export interface WebFormLog {
  action: string;
  dateTime: Date;
  details: WebFormLogDetail[];
  mobileNo: string;
  reason: string;
  remarks: string;
  responseCode: string;
  webFormId: string;
  status: string;
}

export interface AddWebFormLog {
  detailLog: WebFormLogDetail[];
  responseCode: string;
  status: string;
  reason: string;
  remark: string;
}
