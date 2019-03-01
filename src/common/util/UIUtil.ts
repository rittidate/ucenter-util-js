import {StringUtil} from './StringUtil';
import {Locale} from '../locale/model/Locale';
import {ResourceManager} from '../ResourceManager';

let sysToast: any;
let sysAlert: any;
let sysIcon: any;
let sysMessage: any;
let sysErrorDetail: any;
let sysErrorDetailText: any;

const sysLoading: any = {
  style: {
    display: '',
  }
};

let sysYes = {
  textContent: '',
  style: {
    display: 'none'
  }
};

let sysNo = {
  textContent: '',
  style: {
    display: 'none'
  }
};
// @ts-ignore
const _fyesOnClick: any;
// @ts-ignore
const _fnoOnClick: any;
// @ts-ignore
let sysErrorDetailCaret: any = {
  style: {
    display: ''
  }
};
// @ts-ignore
const sysDatePicker: any;
// @ts-ignore
const jQuery: any;
// @ts-ignore
const $: any;

interface MessagePopupType {
  msg: string;
  showButtonType?: ShowButtonType;
  detail: string;
  alertType: AlertType;
  iconType: AlertIconType;
  yesCallback?: any;
  noCallback?: any;
  btnLeftText?: string;
  btnRightText?: string;
}

export enum ShowButtonType {
  yesNo = 'yesNO',
  onlyYes = 'onlyYes'
}

export enum AlertIconType {
  Error = 'Error',
  Warning = 'Warning',
  Success = 'Success',
  Info = 'Info',
  Alert = 'Alert',
  AlertRed = 'AlertRed'
}

export enum AlertType {
  Confirm = 'Confirm',
  Alert = 'Alert'
}

export class UIUtil {
  private static ENTER: '\r\n';
  private static _button = 'BUTTON';
  private static _reset = 'RESET';
  private static _submit = 'SUBMIT';
  private static _nreg = / |,|\$|\€|\£|¥/g;
  private static _preg = / |,|%|\$|\€|\£|¥/g;
  private static _creg = / |,|\$|\€|\£|¥/g;
  public static this = 'error-control';
  public static validation_valid_class = 'valid-control';
  private static _isInit = false;
  public static init() {
    if (this._isInit === false) {
      sysToast = (window as any).sysToast;
      sysAlert = (window as any).sysAlert;
      sysIcon = (window as any).sysIcon;
      sysMessage = (window as any).sysMessage;
      sysErrorDetail = (window as any).sysErrorDetail;
      sysErrorDetailText = (window as any).sysErrorDetailText;
      sysErrorDetailCaret = (window as any).sysErrorDetailCaret;
      sysYes = (window as any).sysYes;
      sysNo = (window as any).sysNo;

      this._isInit = true;
    }
  }

  public static getValue(ctrl, locale?: Locale, eventType?: string): {mustChange: any, value?: any} {
    if (ctrl.type === 'checkbox') {
      return ctrl.checked === true ? {mustChange: true, value: true} : {mustChange: true, value: false};
    } else {
      const datatype = ctrl.getAttribute('data-type');
      if (datatype === 'number' || datatype === 'int') {
        const v: any = ctrl.value.replace(this._nreg, '');
        return isNaN(v) ? {mustChange: false} : {mustChange: true, value: parseFloat(v)};
      } else if (datatype === 'currency' || datatype === 'string-currency') {
        const res: any = UIUtil.getStringCurrency(ctrl.value, locale, ctrl.getAttribute('maxlength'), eventType === 'blur');
        if (datatype !== 'string-currency' && res.value) {
          res.value = parseFloat(res.value);
        }
        return res;
      } else {
        return {mustChange: true, value: ctrl.value};
      }
    }
  }

  private static getStringCurrency(value: string, locale: Locale, maxLength?: number, isOnBlur?: boolean): {mustChange: any, value?: string} {
    value = value.replace(this._creg, '');
    if (value === '') {
      return {mustChange: true, value: ''};
    }
    value = this.extractNumber(value);
    if (value.length === 0) {
      return {mustChange: false};
    }

    const currencyDecimalDigits = locale ? locale.currencyDecimalDigits : 2;
    const groupDigits = 3; // TODO in database locale don't have data
    const decimalSeparator = '.';
    const thousandsSeparator = ',';

    if (isOnBlur) {
      const number = Number(value.replace(/^0+/, ''));
      if (number === 0) {
        return {mustChange: true, value: ''};
      } else {
        value = number.toFixed(currencyDecimalDigits);
      }
    }

    const dotPosition = value.indexOf(decimalSeparator);
    // Format thousands
    let beforeDot = dotPosition > -1 ? value.substr(0, dotPosition) : value;
    beforeDot = beforeDot.replace(new RegExp('\\B(?=(\\d{' + groupDigits + '})+(?!\\d))', 'g'), thousandsSeparator);

    // Cut after dot
    let afterDot;
    if (dotPosition > 0) {
      afterDot = value.substr(dotPosition + 1);
      if (afterDot.length > currencyDecimalDigits) {
        afterDot = afterDot.substr(0, currencyDecimalDigits);
      }
    }
    if (beforeDot.length > maxLength - (currencyDecimalDigits + 1)) {
      return {mustChange: false};
    }

    value = dotPosition > -1 ? beforeDot + decimalSeparator + afterDot : beforeDot;
    return maxLength && value.length > maxLength ? {mustChange: false} : {mustChange: true, value};
  }

  private static extractNumber(str: string): string {
    const arrs: string[] = [];
    let d = false;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charAt(i);  // get char
      if (ch >= '0' && ch <= '9') {
        arrs.push(ch);
      } else if (ch === '.') {
        if (d) {
          return arrs.join('');
        } else {
          d = true;
          arrs.push(ch);
        }
      } else {
        return arrs.join('');
      }
    }
    return arrs.join('');
  }

  public static getLabel(input) {
    if (!input || input.getAttribute('type') === 'hidden') {
      return '';
    }
    let label = input.getAttribute('label');
    if (!label || label.length === 0) {
      let key = input.getAttribute('key');
      if (!key || key.length === 0) {
        key = input.getAttribute('resource-key');
      }
      if (key !== null && key.length > 0) {
        label = ResourceManager.getString(key);
        input.setAttribute('label', label);
        return label;
      } else {
        return this.getLabelFromContainer(input);
      }
    } else {
      return this.getLabelFromContainer(input);
    }
  }

  private static getLabelFromContainer(input) {
    const parent = UIUtil.getControlContainer(input);
    if (parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
      const first = parent.childNodes[0];
      if (first.nodeType === 3) {
        return first.nodeValue;
      }
    }
    return '';
  }

  public static confirm (msg, yesCallback: any = null, noCallback: any = null, btnLeftText: any = null, btnRightText: any = null, iconType: any = null) {
    const messageType = {
      msg,
      showButtonType: ShowButtonType.yesNo,
      detail: null,
      alertType: null,
      iconType,
      yesCallback,
      noCallback,
      btnLeftText,
      btnRightText,
    };
    this.showAlert(messageType);
  }

  public static alertError(msg, detail: string = null, callback: any = null, btnLeftText: any = null, btnRightText: any = null) {
    const messageType = {
      msg,
      showButtonType: ShowButtonType.onlyYes,
      detail,
      alertType: null,
      iconType: null,
      yesCallback: callback,
      noCallback: null,
      btnLeftText,
      btnRightText,
    };
    this.showAlert(messageType);
  }

  // @ts-ignore
  public static alertWarning(msg, detail: string = null, callback: any = null) {
    const messageType = {
      msg,
      showButtonType: ShowButtonType.onlyYes,
      detail,
      alertType: null,
      iconType: null,
      yesCallback: callback,
      noCallback: null,
      btnLeftText: null,
      btnRightText: null,
    };
    this.showAlert(messageType);
  }

  public static alertInfo(msg, detail: string = null, callback: any = null) {
    const messageType = {
      msg,
      showButtonType: ShowButtonType.onlyYes,
      detail,
      alertType: null,
      iconType: null,
      yesCallback: callback,
      noCallback: null,
      btnLeftText: null,
      btnRightText: null,
    };
    this.showAlert(messageType);
  }

  public static alertSuccess(msg, detail: string = null, callback: any = null) {
    const messageType = {
      msg,
      showButtonType: ShowButtonType.onlyYes,
      detail,
      alertType: null,
      iconType: null,
      yesCallback: callback,
      noCallback: null,
      btnLeftText: null,
      btnRightText: null,
    };
    this.showAlert(messageType);
  }

  public static showDatePicker() {
    this.init();
    sysDatePicker.style.display = 'block';
  }

  public static showAlert(messageType: MessagePopupType) {
    const { msg,
            showButtonType = null,
            detail = null,
            alertType = null,
            iconType = null,
            yesCallback = null,
            noCallback = null,
            btnLeftText = 'No',
            btnRightText = 'Yes'
        } = messageType;

    this.init();
    if (alertType === AlertType.Confirm) {
      sysNo.style.display = 'inline-block';
    } else {
      sysNo.style.display = 'none';
    }
    if (!detail) {
      sysErrorDetailCaret.style.display = 'none';
      sysErrorDetail.style.display = 'none';
      sysErrorDetailText.innerHTML = '';
    } else {
      sysErrorDetailCaret.style.display = 'inline-block';
      sysErrorDetail.style.display = 'inline-block';
      sysErrorDetailText.innerHTML = StringUtil.encodeHtml(detail);
    }
    sysMessage.innerHTML = StringUtil.encodeHtml(msg);
    if (iconType === AlertIconType.Error) {
      sysIcon.classList.remove('sa-warning');
      sysIcon.classList.remove('sa-info');
      sysIcon.classList.remove('sa-success');
      sysIcon.classList.remove('animate');
      if (!sysIcon.classList.contains('sa-error')) {
        sysIcon.classList.add('sa-error');
      }
      sysIcon.innerHTML = '<span class="sa-x-mark"><span class="sa-line sa-left"></span><span class="sa-line sa-right"></span></span>';
    } else if (iconType === AlertIconType.Info) {
      sysIcon.classList.remove('sa-error');
      sysIcon.classList.remove('sa-warning');
      sysIcon.classList.remove('sa-success');
      sysIcon.classList.remove('animate');
      sysIcon.classList.remove('warning-red-icon');
      if (!sysIcon.classList.contains('sa-info')) {
        sysIcon.classList.remove('warning-icon');
        sysIcon.classList.remove('grayscale-img');
        sysIcon.classList.add('alert-icon');
        sysIcon.classList.add('sa-info');
      }
      sysIcon.innerHTML = '';
    } else if (iconType === AlertIconType.Warning) {
      sysIcon.classList.remove('sa-error');
      sysIcon.classList.remove('sa-info');
      sysIcon.classList.remove('sa-success');
      sysIcon.classList.remove('animate');
      sysIcon.classList.remove('warning-red-icon');
      if (!sysIcon.classList.contains('sa-warning')) {
        sysIcon.classList.remove('warning-icon');
        sysIcon.classList.add('sa-warning');
      }
      sysIcon.innerHTML = '<span class="sa-body"></span><span class="sa-dot"></span>';
    } else if (iconType === AlertIconType.Alert) {
      sysIcon.classList.remove('sa-error');
      sysIcon.classList.remove('sa-info');
      sysIcon.classList.remove('sa-success');
      sysIcon.classList.remove('animate');
      if (!sysIcon.classList.contains('warning-icon')) {
        sysIcon.classList.remove('alert-icon');
        sysIcon.classList.remove('warning-red-icon');
        sysIcon.classList.add('warning-icon');
        sysIcon.classList.add('grayscale-img');
      }
      if (!sysIcon.classList.contains('sa-warning')) {
        sysIcon.classList.add('sa-warning');
      }
      sysIcon.innerHTML = '<span class="sa-body"></span><span class="sa-dot"></span>';
    } else if (iconType === AlertIconType.AlertRed) {
      sysIcon.classList.remove('sa-error');
      sysIcon.classList.remove('sa-info');
      sysIcon.classList.remove('sa-success');
      sysIcon.classList.remove('animate');
      if (!sysIcon.classList.contains('warning-red-icon')) {
        sysIcon.classList.remove('alert-icon');
        sysIcon.classList.remove('grayscale-img');
        sysIcon.classList.remove('warning-icon');
        sysIcon.classList.add('warning-red-icon');
      }
      if (!sysIcon.classList.contains('sa-warning')) {
        sysIcon.classList.add('sa-warning');
      }
      sysIcon.innerHTML = '<span class="sa-body"></span><span class="sa-dot"></span>';
    } else {
      sysIcon.classList.remove('sa-error');
      sysIcon.classList.remove('sa-warning');
      sysIcon.classList.remove('sa-info');
      sysIcon.classList.remove('warning-red-icon');
      if (!sysIcon.classList.contains('sa-success')) {
        sysIcon.classList.add('sa-success');
      }
      if (!sysIcon.classList.contains('animate')) {
        sysIcon.classList.add('animate');
      }
      sysIcon.innerHTML = '<span class="sa-line sa-tip animateSuccessTip"></span><span class="sa-line sa-long animateSuccessLong"></span><div class="sa-placeholder"></div><div class="sa-fix"></div>';
    }
    if (showButtonType === ShowButtonType.onlyYes) {
      sysYes.style.display = 'inline-block';
      sysNo.style.display = 'none';
    } else {
      sysYes.style.display = 'inline-block';
      sysNo.style.display = 'inline-block';
    }
    sysYes.textContent = btnRightText;
    sysNo.textContent = btnLeftText;
    sysAlert.style.display = 'block';
    (window as any).fyesOnClick = yesCallback;
    (window as any).fnoOnClick = noCallback;
  }

  public static showToast(msg) {
    this.init();
    sysToast.innerHTML = msg;
    const ui = this;
    ui.fadeIn(sysToast);
    setTimeout(() => {
      ui.fadeOut(sysToast);
    }, 1340);
  }

  /* tslint:disable */
  public static fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  public static showLoading = (isFirstTime) => {
    try {
      if ((window as any).sysLoading !== undefined) {
        (window as any).sysLoading.style.display = 'block';
        if(isFirstTime){
        (window as any).sysLoading.classList.add('dark');
        } else {
          (window as any).sysLoading.classList.remove('dark');
        }
      }
    } catch (e) {
      throw e;
    }
  }

  public static hideLoading = () => {
    try {
      if ((window as any).sysLoading !== undefined) {
        (window as any).sysLoading.style.display = 'none';
      }
    } catch (e) {
      throw e;
    }
  }

  public static fadeIn(el, display = null) {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      let val = parseFloat(el.style.opacity);
      val += .1;
      if (!(val > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  public static bindToForm(form, obj) {
    for (const f of form) {
      let ctrl = f;
      if (ctrl.name !== null && ctrl.name !== '') {
        let v = obj[ctrl.name];
        if (v === undefined || v === null) {
          v = null;
        }
        ctrl = v;
      }
    }
  }

  public static decodeFromForm(form): any {
    if (!form) {
      return null;
    }
    const obj = {};
    for (let i = 0; i < form.length; i++) {
      const ctrl = form[i];
      const name = ctrl.getAttribute('name');
      if (name != null && name.length > 0) {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT') {
          switch (type) {
            case 'checkbox':
              if (ctrl.checked === 'checked') {
                obj[name] = true;
              }
              break;
            case 'radio':
              if (ctrl.checked === 'checked') {
                obj[name] = ctrl.value;
              }
              break;
            default:
              obj[name] = ctrl.value;
          }
        }
      }
    }
    return obj;
  }

  public static equalsValue(ctrl1, ctrl2) {
    if (ctrl1 === ctrl2) {
      return true;
    } else {
      return false;
    }
  }

  public static isEmpty(ctrl) {
    if (!ctrl) { return true; }
    const str = this.trimText(ctrl.value);
    return (str === '');
  }

  public static trim(ctrl) {
    if (!ctrl) {
      return;
    }
    const str = ctrl.value;
    const str2 = this.trimText(ctrl.value);
    if (str !== str2) {
      ctrl.value = str2;
    }
  }

  public static focusFirstControl(form) {
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      if (!(ctrl.readOnly || ctrl.disabled)) {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT'
          && nodeName !== 'CHECKBOX'
          && nodeName !== 'RADIO') {
          ctrl.focus();
          ctrl.scrollIntoView();
          try {
            ctrl.setSelectionRange(0, ctrl.value.length);
          } catch (error) {
          }
          return;
        }
      }
    }
  }

  public static focusErrorControl(form) {
    const len = form.length;
    for (let i = 0; i < len; i++) {
      const ctrl = form[i];
      const parent = ctrl.parentElement;
      if (ctrl.classList.contains(this.this)
        || ctrl.classList.contains('.ng-invalid')
        || parent.classList.contains(this.this)) {
        ctrl.focus();
        ctrl.scrollIntoView();
        return;
      }
    }
  }

  public static getControlContainer(control) {
    const p = control.parentElement;
    if (p.nodeName === 'LABEL' || p.classList.contains('form-group')) {
      return p;
    } else {
      const p1 = p.parentElement;
      if (p.nodeName === 'LABEL' || p1.classList.contains('form-group')) {
        return p1;
      } else {
        const p2 = p1.parentElement;
        if (p.nodeName === 'LABEL' || p2.classList.contains('form-group')) {
          return p2;
        } else {
          const p3 = p2.parentElement;
          if (p.nodeName === 'LABEL' || p3.classList.contains('form-group')) {
            return p3;
          } else {
            return null;
          }
        }
      }
    }
  }

  public static getControlFromForm(form, childName) {
    for (const f of form) {
      if (f.name === childName) {
        return f;
      }
    }
    return null;
  }

  public static getControlByName(ctrl, childName, ctrlType) {
    if (!ctrlType) {
      ctrlType = 'input';
    }
    const jctrl = $(ctrl);
    const selector = '' + ctrlType + '[name=\'' + childName + '\']';
    const sub = jctrl.find(selector);
    return sub[0];
  }

  public static getParentByClass(ctrl, className) {
    if (!ctrl) {
      return null;
    }
    let tmp = ctrl;
    while (true) {
      const parent = tmp.parentElement;
      if (!parent) {
        return null;
      }
      if (parent.classList.contains(className)) {
        return parent;
      } else {
        tmp = parent;
      }
      if (tmp.nodeName === 'BODY') {
        return null;
      }
    }
  }

  public static getParentByNodeNameOrDataField(ctrl, nodeName: string) {
    if (!ctrl) {
      return null;
    }
    let tmp = ctrl;
    while (true) {
      const parent = tmp.parentElement;
      if (!parent) {
        return null;
      }
      if (parent.nodeName == nodeName || parent.getAttribute('data-field') != null) {
        return parent;
      } else {
        tmp = parent;
      }
      if (tmp.nodeName === 'BODY') {
        return null;
      }
    }
  }

  private static trimText(s) {
    if (s === null || s === undefined) {
      return;
    }
    s = s.trim();
    let i = s.length - 1;
    while (i >= 0 && (s.charAt(i) === ' ' || s.charAt(i) === '\t' || s.charAt(i) === '\r' || s.charAt(i) === '\n')) {
      i--;
    }
    s = s.substring(0, i + 1);
    i = 0;
    while (i < s.length && (s.charAt(i) === ' ' || s.charAt(i) === '\t' || s.charAt(i) === '\r' || s.charAt(i) === '\n')) {
      i++;
    }
    return s.substring(i);
  }
}
