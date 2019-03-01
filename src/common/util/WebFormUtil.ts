import axios, {AxiosRequestConfig} from 'axios';
import {Observable, throwError} from 'rxjs';
import {fromPromise} from 'rxjs-compat/observable/fromPromise';
import {catchError, map} from 'rxjs/operators';
import {LoadingUtil} from './LoadingUtil';
import webFormLogger from '../logging/WebFormLogger';
import {storage} from '../storage';

export class WebFormUtil {
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

  public static postObject<T>(url: string, obj: any, hideLoading: boolean = false): Observable<T> {
    const startTime = window.performance.now();
    if (!hideLoading) {
      LoadingUtil.showLoading();
    }
    return fromPromise(axios.post<T>(url, obj, this.getHttpOptions())).pipe(map(item => {
      const endTime = window.performance.now();
      LoadingUtil.hideLoading();
      const shouldThrowError = webFormLogger.handleResponse({ details: item, processTime: endTime - startTime });
      if (shouldThrowError) {
        LoadingUtil.resetLoading();
        throwError(item);
      } else {
        return item.data;
      }
    })).pipe(catchError(errors => {
      const endTime = window.performance.now();
      webFormLogger.handleResponse({ details: errors, processTime: endTime - startTime });
      LoadingUtil.resetLoading();
      return throwError(errors);
    }));
  }
}
