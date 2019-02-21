export class StringUtil {
  private static ENTER: '\r\n';
  private static __decimal_char: ',';
  private static _emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i;
  private static _phoneRegex = /^[1]?[-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  private static _phoneRegex2 = /^[+][1][-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  private static _creg = / |,|\$|\€|\£|\£|¥/g;
  private static _passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

  private static _urlRegExp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  private static _intRegex = /^\d+$/;

  private static _percentRegex = /^[1-9][0-9]?$|^100$/;
  private static _digitRegExp = /^\d+$/;
  private static _characterOrDigitRegExp = /^\w*\d*$/;
  private static _numberAndDashRegExp = /^[0-9-]*$/;

  public static replaceAll(value: string, strFind: string, strReplace: string): string {
    let str = value;
    while (str.indexOf(strFind) >= 0) {
      str = str.replace(strFind, strReplace);
    }
    return str;
  }

  public static param(obj: any): string {
    const keys = Object.keys(obj);
    const arrs = [];
    for (const item of keys) {
      const str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
      arrs.push(str);
    }
    return arrs.join('&');
  }

  public static trim(s: string): string {
    if (!s) {
      return;
    }
    s = s.trim();
    const sRetVal = '';
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

  public static camelCaseToHuman(arg: string) {
    if (arg) {
      return arg
        .replace(/([A-Z])/g, ' $1') // insert a space before all caps
        .replace(/^./, (str) => {
          return str.toUpperCase();
        }); // uppercase the first character
    } else {
      return '';
    }
  }

  public static safeQuery(inputValue: string): string {
    // Code logic avoid injection here
    return inputValue;
  }

  public static encodeHtml(str: string): string {
    return str;
  }

  public static encodeSql(str: string): string {
    // Code logic avoid injection here
    return str;
  }

  public static indexOf(arrs, str, keyValue, ignoreCase: boolean): number {
    if (!arrs || arrs.length === 0) {
      return -1;
    }
    for (let i = 0; i < arrs.length; i++) {
      let valueArray = arrs[i];

      if (keyValue && keyValue.length) {
        valueArray = arrs[i][keyValue];
      }

      if (ignoreCase === true) {
        if (valueArray.toUpperCase() === str.toUpperCase()) {
          return i;
        }
      } else {
        if (valueArray === str) {
          return i;
        }
      }
    }
    return -1;
  }

  public static isEmpty(str: string): boolean {
    return (!str || str === '');
  }

  public static toLowerCase(str: string): string {
    if (!str || str === '') {
      return str;
    }
    return str.toLowerCase();
  }

  public static searchWildCard = (text , searchKey) => {
    const newText = StringUtil.toLowerCase(text);
    const newSearchKey = StringUtil.toLowerCase(searchKey);
    return newText.includes(newSearchKey);
  }

  public static toUpperCase(str: string): string {
    if (!str || str === '') {
      return str;
    }
    return str.toUpperCase();
  }

  public static isEmail(email: string): boolean {
    if (!email || email.length === 0) {
      return false;
    }
    return this._emailReg.test(email);
  }

  public static isPhone(str: string): boolean {
    // const intRegex = /^[1]?([0-9]{3})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    // Ed. With optional brackets (actually parenthesis) for area code (untested):
    return this._phoneRegex.test(str) || this._phoneRegex2.test(str);
  }

  public static isEmptyCurrency(value: string): boolean {
    if (value) {
      let v = value.trim();
      v = v.replace(this._creg, '');
      if (v.length === 0) {
        return true;
      } else if (isNaN(parseFloat(v))) {
        return false;
      } else {
        const num = parseFloat(v);
        return (num === 0 ? true : false);
      }
    }
    return true;
  }

  public static isValidPassword(password: string): boolean {
    return this._passwordRegex.test(password);
  }

/*private static _urlReg =/^(ftp|https?):\/\/+(www\.)?([0-9A-Za-z-\\
.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?/i;
    public static isUrl(url: string): boolean {
      // let RegExp = //i;
      // return RegExp.test(url);
      return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)' +
        '?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
    },

    private static isUrl(url: string): boolean {
      // let RegExp = //i;
      // return RegExp.test(url);
      return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)' +
        '?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
  },*/
  public static isValidPattern(patternStr: string, modifier: string, value: string): boolean {
    if (!StringUtil.isEmpty(patternStr)) {
      const pattern = new RegExp(patternStr, modifier);
      return pattern.test(value);
    } else {
      return false;
    }
  }

  public static isValidURL(url: string): boolean {
    return this._urlRegExp.test(url);
  }

  public static isInteger(a): boolean {
    return this._intRegex.test(a);
  }

  public static isPercentage(a): boolean {
    return this._percentRegex.test(a);
  }

  public static isTime4(str: string): boolean {
    if (!str || str.length !== 4) {
      return false;
    }
    if (this.isInteger(str) === false) {
      return false;
    }
    const hours = parseInt(str.substring(0, 2), null);
    const minutes = parseInt(str.substring(2), null);
    if (hours > 24 || minutes > 59) {
      return false;
    } else {
      return true;
    }
  }

  public static isNumber(a): boolean {
    // const re = new RegExp('^\\d+$|\\d*' + this.__decimal_char + '\\d+');
    // return re.test(a);
    if (!a || a.length === 0) {
      return false;
    } else {
      return (!isNaN(a));
    }
  }

  public static nextNumber(val) {
    if (isNaN(val)) {
      return val;
    }
    const length = val.length;
    let num = (parseFloat(val) + 1) + '';
    while (num.length <= length) {
      num = '0' + num;
    }
    return num;
  }

  public static format(...args: any[]): string {
    let formatted = args[0];
    if (StringUtil.isEmpty(formatted)) {
      return '';
    }
    if (args.length > 1 && Array.isArray(args[1])) {
      const params = args[1];
      for (let i = 0; i < params.length; i++) {
        const regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, params[i]);
      }
    } else {
      for (let i = 1; i < args.length; i++) {
        const regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
        formatted = formatted.replace(regexp, args[i]);
      }
    }
    return formatted;
  }

  public static removePhoneFormat(phone: string): string {
    if (phone) {
      return phone.replace(/ |\+|\-|\.|\(|\)/g, '');
    } else {
      return phone;
    }
  }

  public static formatPhone(phoneNumber1): string {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    // reformat phone number
    // (555) 123-4567 or +1 (555) 123-4567
    let formatedPhone = phoneNumber1;
    const phoneNumber = StringUtil.removePhoneFormat(phoneNumber1);
    if (phoneNumber.length === 10) {
      const USNumber = phoneNumber.match(/(\d{3})(\d{3})(\d{4})/);
      formatedPhone = '(' + USNumber[1] + ') ' + USNumber[2] + '-' + USNumber[3];
    } else if (phoneNumber.length === 11) {
      const USNumber = phoneNumber.match(/(\d{1})(\d{3})(\d{3})(\d{4})/);
      formatedPhone = '+' + USNumber[1] + ' (' + USNumber[2] + ') ' + USNumber[3] + '-' + USNumber[4];
    }
    return formatedPhone;
  }

  public static formatSql(): string {
    let formatted = arguments[0];
    if (StringUtil.isEmpty(formatted)) {
      return '';
    }
    for (let i = 1; i < arguments.length; i++) {
      const regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
      formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
  }

  /*
  getParameter() {
    let searchString = window.location.search.substring(1), params = searchString.split('&'), hash = {};

    for (let i = 0; i < params.length; i++) {
      let val = params[i].split('=');
      hash[encodeURI(val[0])] = encodeURI(val[1]);
    }
    return hash;
  },
  */
  public static isLong(value): boolean {
    if (!value || value.length === 0) {
      return false;
    } else if (value.indexOf('.') >= 0) {
      return false;
    } else if (isNaN(value)) {
      return false;
    } else {
      return true;
    }
  }

  public static isULong(value): boolean {
    if (!value || value.length === 0) {
      return false;
    } else if (value.indexOf('.') >= 0) {
      return false;
    } else if (isNaN(value)) {
      return false;
    } else {
      if (value >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  public static toInt(value): number {
    if (!value || value === '') {
      return 0;
    }
    if (isNaN(parseInt(value, null))) {
      return 0;
    }
    return parseInt(value, null);
  }

  public static convertToDbTime(value: string): string {
    let result = value.replace(':', '');
    if (result.length === 3) {
      result = '0' + result;
    }
    return result;
  }

  public static trimEnterChar(value): string {
    if (!value) {
      return value;
    }
    value = value.replaceAll('\r\n', '');
    value = value.replaceAll(StringUtil.ENTER, '');
    value = value.replaceAll('\r', '');
    value = value.replaceAll('\n', '');
    value = value.replaceAll('\t', '');
    return value;
  }

  public static padLeft(str, length, pad) {
    if (!str) {
      return str;
    }
    if (typeof str !== 'string') {
      str = '' + str;
    }
    if (str.length >= length) {
      return str;
    }
    let str2 = str;
    if (!pad) {
      pad = ' ';
    }
    while (str2.length < length) {
      str2 = pad + str2;
    }
    return str2;
  }

  public static padRight(str, length, pad) {
    if (!str) {
      return str;
    }
    if (typeof str !== 'string') {
      str = '' + str;
    }
    if (str.length >= length) {
      return str;
    }
    let str2 = str;
    if (!pad) {
      pad = ' ';
    }
    while (str2.length < length) {
      str2 = str2 + pad;
    }
    return str2;
  }

  public static removeUniCode(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|$|_/g, '-');
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str = str.replace(/-+-/g, '-'); // thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, '');
    // cắt bỏ ký tự - ở đầu và cuối chuỗi
    return str;
  }

  public static removeLocal(str: string): string {
    return str.replace(',', '.');
  }

  public static htmlBinding(str: string): string {
    if (!!str) {
      return str.split('\n').join('<br />');
    }
    return str;
  }

  public static isDigitalCode(str: string): boolean {
    return this._digitRegExp.test(str);
  }

  public static isCharacterOrDigitCode(str: string): boolean {
    return this._characterOrDigitRegExp.test(str);
  }

  public static isDigitOnly(str: string): boolean {
    return this._digitRegExp.test(str);
  }

  public static isStringAccountNumber(stringAccountNumber): boolean {
    return this._digitRegExp.test(stringAccountNumber);
  }

  public static isStringNumberAndDash(stringRoutingNumber): boolean {
    return this._numberAndDashRegExp.test(stringRoutingNumber);
  }

  public static isStringCheckNumber(stringCheckNumber): boolean {
    const RegExp = /^\d{0,8}$/;
    return RegExp.test(stringCheckNumber);
  }

  public static isStringSSNNumber(stringNumber): boolean {
    const RegExp = /^\d+$/;
    return RegExp.test(stringNumber);
  }

  public static isAmountNumber(amountNumber): boolean {
    const regExp = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/;
    return regExp.test(amountNumber);
  }

  public static isUSPostalCode(postalCode): boolean {
    const regExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return regExp.test(postalCode);
  }

  public static isCAPostalCode(postalCode): boolean {
    // For Canada Postal codes do not include the letters D, F, I, O, Q or U, and the first position also does not make use of the letters W or Z.
    const regExp = /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][ -]?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]$/;
    // /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return regExp.test(postalCode);
  }

  public static getTimeViews(): any {
    const arr = [{
      value: '00',
      text: '00'
    },
      {
        value: '15',
        text: '15'
      },
      {
        value: '30',
        text: '30'
      },
      {
        value: '45',
        text: '45'
      }];
    return arr;
  }

  public static getDayOfWeek(): any {
    const arr = [
      {
        value: '0',
        text: 'Monday'
      },
      {
        value: '1',
        text: 'Tuesday'
      },
      {
        value: '2',
        text: 'Wednesday'
      },
      {
        value: '3',
        text: 'Thursday'
      },
      {
        value: '4',
        text: 'Friday'
      },
      {
        value: '5',
        text: 'Saturday'
      },
      {
        value: '6',
        text: 'Sunday'
      }];
    return arr;
  }

  public static getNatural(num): any {
    return parseFloat(num.toFixed(2).toString().split('.')[0]);
  }

  public static getDecimal(num): any {
    const decimal = parseFloat(num.toFixed(2).toString().split('.')[1]);
    if (decimal < 10) {
      return decimal.toString() + '0';
    }
    return decimal.toString();
  }

  public static getMax(array): any {
    return Math.max.apply(Math, array);
  }

  // Input is 2230 -> 22.5
  public static getHours(str): any {
    const natural = Math.floor(str / 100);
    const decimal = (str % 100) / 60;
    return natural + decimal;
  }

  public static generateStringFromLength = (leng, char = '0') => {
    let str = '';
    for (let i = 0; i < leng ; i++) {
      str += char;
    }
    return str;
  }

  public static strToObj (str = null, strReplace = null) {
    if (strReplace && str) {
      str = str.replace(strReplace, '"');
    }
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  }

}
