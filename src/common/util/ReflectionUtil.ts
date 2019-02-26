import * as moment from 'moment';

export class ReflectionUtil {
  private static getDirectValue = (object, key) => {
    if (object && object.hasOwnProperty(key)) {
      return object[key];
    }
    return null;
  }

  public static valueOf = (object, key) => {
    return key.split('.').reduce((acc, current, index, source) => {
      const value = ReflectionUtil.getDirectValue(acc, current);
      if (!value) {
        source.splice(1);
      }
      return value;
    }, object);
  }

  public static isNull(obj) {
    return !obj;
  }
  public static clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
  public static dateToISO(obj) {
    const keys = Object.keys(obj);
    for (const item of keys) {
      const key = item;
      const v = obj[key];
      if (!!v) {
        if (v instanceof Date) {
          obj[key] = this.toISO(obj[key]);
        } else if (Array.isArray(v)) {
          this.dateToISO(v);
           }
      }
    }
  }

  public static trimString = (obj) => {
    const obj2 = {};
    Object.keys(obj).forEach(key => {
      const v = obj[key];
      if (v && typeof v === 'string') {
        const v2 = v.trim();
        if (v2 !== v) {
          obj2[key] = v2;
        }
      }
    });
    return obj2;
  }

  public static trimObject = (obj) => {
    Object.keys(obj).forEach(key => {
      const v = obj[key];
      if (v) {
        if (typeof v === 'string') {
          const v2 = v.trim();
          if (v2 !== v) {
            obj[key] = v2;
          }
        } else if (typeof v === 'object') {
          ReflectionUtil.trimObject(obj[key]);
        }
      }
    });
    return obj;
  }

  private static toISO(date): string {
    if (!date || date === '') { return ''; }
    return moment(date).format();
  }

  public static isEqualObject(obj1, obj2) {
    return (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') ?
      (Object.keys(obj1).length === Object.keys(obj2).length) &&
        Object.keys(obj1).reduce((isEqual, key) => {
          return isEqual && this.isEqualObject(obj1[key], obj2[key]);
        }, true) : (obj1 === obj2);
  }
}
