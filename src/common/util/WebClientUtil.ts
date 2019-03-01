import axios, {AxiosRequestConfig} from 'axios';
import {Observable, of, throwError} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, map} from 'rxjs/operators';
import {LoadingUtil} from './LoadingUtil';
import {storage} from '../storage';

export class WebClientUtil {
  public static getHttpOptions(): AxiosRequestConfig {
    const token = storage.getToken();
    if (token === null) {
      const httpOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      };
      return httpOptions;
    } else {
      const httpOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + token
        }
      };
      return httpOptions;
    }
  }

  public static get(url: string): Observable<object> {
    return fromPromise(axios.get(url, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    }));
  }

  public static getObject<T>(url: string): Observable<T> {
    return fromPromise(axios.get<T>(url, this.getHttpOptions()))
      .pipe(map(item => {
        return item.data;
      }));
  }

  public static postObject<T>(url: string, obj: any, hideLoading: boolean = false): Observable<T> {
    if (!hideLoading) {
      LoadingUtil.showLoading();
    }
    return fromPromise(axios.post<T>(url, obj, this.getHttpOptions())).pipe(map(item => {
      const endTime = window.performance.now();
      LoadingUtil.hideLoading();
      return item.data;
    })).pipe(catchError(errors => {
      LoadingUtil.resetLoading();
      return throwError(errors);
    }));
  }

  public static postRequest(url: string, obj: any): Observable<object> {
    return fromPromise(axios.post(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    }));
  }

  public static putRequest(url: string, obj: any): Observable<object> {
    return fromPromise(axios.put(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    }));
  }

  public static putObject<T>(url: string, obj: any): Observable<T> {
    return fromPromise(axios.put<T>(url, obj, this.getHttpOptions())).pipe(map(item => {
      return item.data;
    }));
  }
}
