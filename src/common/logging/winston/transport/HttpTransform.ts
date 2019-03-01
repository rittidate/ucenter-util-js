import config from '../../../../config';
/**
 * This class should extends from Winston-transport.
 * TODO: implement latter
 */
export class HttpTransform {
  public static getReportHttpOption() {
    const uri = new URL(config.reportUrl + '/' + config.reportPath, location.origin);
    const httpOptions =  {
      ssl: uri.protocol.startsWith('https') ? true : false,
      host: uri.host,
      path: uri.pathname,
    };
    if ( uri.port ) {
      httpOptions['port'] = uri.port;
    }
    // console.log(httpOptions);
    return httpOptions;
  }
}
