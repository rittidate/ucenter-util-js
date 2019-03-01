import {Native} from './Native';

export class NativeFunction {
  static callNativeFunc = (data: Native) => {
    const arg = {
      action: data.functionName,
      params: data.params
    };
    try {
      switch (data.osPlatform.toLowerCase()) {
        case 'ios':
          (window as any).webkit.messageHandlers['CallNative'].postMessage(arg);
          break;
        case 'android':
          (window as any).webkit['CallNative'](JSON.stringify(arg));
          break;
        default:
          try {
            (window as any).webkit.messageHandlers['CallNative'].postMessage(arg);
          } catch (e) {
            (window as any).webkit['CallNative'](JSON.stringify(arg));
          }
          break;
      }
    } catch (e) {
      // if (process.env.REACT_APP_ENV === 'SIT' || process.env.REACT_APP_ENV === 'LOCAL_SIT') {
       throw e;
      // }
    }
  }

  static showNativeLoading = ({ osPlatform = '', params = {} }) => {
    NativeFunction.callNativeFunc({ osPlatform, functionName: 'showLoading', params });
  }

  static hideNativeLoading = ({ osPlatform = '', params = {} }) => {
    NativeFunction.callNativeFunc({ osPlatform, functionName: 'hideLoading', params });
  }

  static extendInboxSession = ({ osPlatform = '', sender }) => {
    const params = {
      sender: '',
      extendSessionDateTime: ''
    };
    NativeFunction.callNativeFunc({ osPlatform, functionName: 'extendInboxSessionId', params });
  }

  static veriryPin = ({ osPlatform = '', params = {} }) => {
    NativeFunction.callNativeFunc({ osPlatform, functionName: 'openPin', params });
  }

  static updateResultResponse = ({ osPlatform = '', sender, code, desc, freeText, updateFlag = true }) => {
    const params = {
      sender, // form Name
      code, // response from service example submit
      desc,
      freeText, // freeText is string as a json format
      updateFlag // if don't have any process to do set it to TRUE, otherwise FALSE
    };
    NativeFunction.callNativeFunc({ osPlatform, functionName: 'updateResult', params });
  }

  static closeWeb = ({ osPlatform = '', backToRoot = '', status = '', menuCode = '' }) => {
    const params = {
      code: status,
      backToRoot,
      menuCode,
    };
    NativeFunction.callNativeFunc({ osPlatform, functionName: 'closeNative', params });
  }

  static callWebForm = (args) => {
    try {
      args = JSON.parse(args);
      switch (args.action) {
        case 'afterVerifyPin': (window as any).AfterVerifyPin(); break;
        case 'afterExtendSessionId': (window as any).afterExtendSessionId(args.params); break;
        case 'init': {
          (window as any).initFunction(args.params);
          break;
        } // window.init( args.params ); break;  // TO DO: will call iniFunction at beginning load from native app

        default: NativeFunction.notFoundFunction(); break;
      }
    } catch (e) {
      (window as any).callWebForm = undefined;
    } finally {
    }
  }

  static notFoundFunction = () => {
    // throw e
  }
}
