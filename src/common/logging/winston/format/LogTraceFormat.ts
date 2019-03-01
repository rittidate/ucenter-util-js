import {format} from 'winston';
import {storage} from '../../../storage';

export const LogTraceFormat = format( info => {

  const ns = storage.getInitModel();
  if (ns) {
    info.mobileNo = ns.mobileNo;
    info.mobileOS = ns.mobileOS;
    info.osVersion = ns.osVersion;
    info.appVersion = ns.appVersion;
    info.language = ns.language;
    info.feedId = ns.feedId;
    info.formId = ns.formId;
    info.inboxSessionId = ns.inboxSessionId;
    info.appId = ns.appId;
    info.appId = ns.corrId;
  }
  return info;
});
