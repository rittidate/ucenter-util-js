import {UserAccount} from './UserAccount';
import {Flow} from './flow/Flow';
import {InitModel} from './InitModel';
import {WebFormLog, AddWebFormLog} from './WebFormLog';

export class storage {
  public static tmpSearchModel = null;
  public static signinMessage = null;
  public static lastSuccessTime = null;

  private static _user = null;
  public static _sessionStorageAllowed = true;
  private static _flows: any = {};
  private static _webFormLog: WebFormLog;

  public static getRedirectUrl() {
    return encodeURIComponent(location.origin + '/index.html?redirect=oAuth2');
  }

  public static setUser(user: UserAccount) {
    storage._user = user;
    if (storage._sessionStorageAllowed === true) {
      try {
        if (user != null) {
          sessionStorage.setItem('authService', JSON.stringify(user));
        } else {
          sessionStorage.removeItem('authService');
        }
      } catch (err) {
        storage._sessionStorageAllowed = false;
      }
    }
  }
  public static getUser(): UserAccount {
    let user = storage._user;
    if (!user) {
      if (storage._sessionStorageAllowed === true) {
        try {
          const authService = sessionStorage.getItem('authService');
          if (!!authService) {
            storage._user = JSON.parse(authService);
            user = storage._user;
          }
        } catch (err) {
          storage._sessionStorageAllowed = false;
        }
      }
    }
    return user;
  }
  public static getUserId(): any {
    const user = storage.getUser();
    if (!user) {
      return '';
    } else {
      return user.userId;
    }
  }
  public static getUserName(): any {
    const user = storage.getUser();
    if (!user) {
      return '';
    } else {
      return user.userName;
    }
  }
  public static getToken(): string {
    const user = storage.getUser();
    if (!user) {
      return null;
    } else {
      return user.token;
    }
  }
  public static getFlow(flowId: string): Flow {
    return this._flows[flowId];
  }
  public static setFlow(flowId: string, flow: Flow) {
    this._flows[flowId] = flow;
  }
  private static _initData: InitModel;
  public static setInitModel(initData: InitModel) {
    this._initData = initData;
  }
  public static getInitModel() {
    return this._initData;
  }

  public static getWebFormLog() {
    return this._webFormLog;
  }

  public static addWebFormLogDetail(data: AddWebFormLog) {
    if (!this._webFormLog) {
      this._webFormLog = {
        action: null,
        remarks: null,
        reason: null,
        responseCode: null,
        status: '',
        details: [],
        dateTime: new Date(),
        webFormId: this.getInitModel() && this.getInitModel().formId,
        mobileNo: this.getInitModel() && this.getInitModel().mobileNo
      }
    }
    data.detailLog.forEach(item => {
      this._webFormLog.details.push(item);
    })
    this._webFormLog.responseCode = data.responseCode;
    this._webFormLog.dateTime = new Date();
    this._webFormLog.status = data.status;
    this._webFormLog.remarks = data.remark;
    this._webFormLog.reason = data.reason;
  }
}
