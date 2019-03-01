import {ReflectionUtil} from '../util/ReflectionUtil';
import {storage} from '../storage';
import {WebFormLogDetail} from '../WebFormLog';

interface RequestDetail {
  details: any;
  processTime: number;
}

export interface ResponseHeader {
  corrId: string;
  errors: any;
  inboxSessionId: string;
  mobileNo: string;
  requestDateTime: string;
  requestedUniqueId: string;
  responseCode: string;
  responseDateTime: string;
  responseDesc: string;
  responseId: string;
  status: string;
}

class WebFormLogger {
  private handleWithServerError(detail: RequestDetail) {
    const logDetail: WebFormLogDetail = {
      from: 'Client',
      to: 'UCT',
      reason: ReflectionUtil.valueOf(detail, 'details.response.data') || ReflectionUtil.valueOf(detail, 'details.message'),
      remark: ReflectionUtil.valueOf(detail, 'details.config.data'),
      processTime: Math.round(detail.processTime),
      rqUid: null,
      rsUid: null,
      status: 'F'
    };
    return [logDetail];
  }

  private handleWithResponse(detail: RequestDetail) {
    const logDetailFromServer: WebFormLogDetail[] = ReflectionUtil.valueOf(detail, 'details.data.data.logDetails') || [];
    const responseHeader: ResponseHeader = ReflectionUtil.valueOf(detail, 'details.data.header');
    // const bodyData = detail.details.data;

    const status = responseHeader.responseCode === '200' ? 'S' : 'F';
    const reason = responseHeader.status === 'F' ? 'Fail' : null;
    const remark = responseHeader.status === 'F' ? ReflectionUtil.valueOf(detail, 'details.config.data') : null;

    const logDetail: WebFormLogDetail = {
      from: 'Client',
      to: 'UCT',
      reason,
      remark,
      processTime: Math.round(detail.processTime),
      rqUid: responseHeader.requestedUniqueId ? responseHeader.requestedUniqueId : null,
      rsUid: responseHeader.responseId ? responseHeader.responseId : null,
      status
    };
    const mappingLogDetailFromServer = logDetailFromServer.map(item => {
      return { ...item, from: 'UCT' };
    });
    return [logDetail, ...mappingLogDetailFromServer];
  }

  public handleResponse(detail: RequestDetail): boolean {
    if (detail.details.status === 200) {
      const data = detail.details.data;
      const responseHeader: ResponseHeader = data.header;
      const mapping = this.handleWithResponse(detail);
      storage.addWebFormLogDetail({
        detailLog: mapping,
        reason: mapping[0].reason,
        remark: mapping[0].remark,
        responseCode: responseHeader.responseCode,
        status: responseHeader.status
      });
      return responseHeader.status === 'F';
    } else {
      const mapping = this.handleWithServerError(detail);
      storage.addWebFormLogDetail({
        detailLog: mapping,
        reason: mapping[0].reason,
        remark: mapping[0].remark,
        responseCode: '500',
        status: 'F'
      });
      return true;
    }
  }
}


const webFormLogger = new WebFormLogger();

export default webFormLogger;
