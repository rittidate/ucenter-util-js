const localConfigUrl = {
  kPlusLegacyUrl            : 'http://localhost:8088',
  kPlusLegacyJSUrl          : 'http://localhost:8088',
  commonUrl                 : 'http://localhost:8088',
  logUrl                    : 'http://localhost:8088',
  baseUrl                   : 'http://localhost:8088',
  commonJsUrl               : 'http://localhost:8088',
  reportUrl                 : 'http://localhost:8088',
  grabUrl                   : 'http://localhost:8088',
  kplUrl                    : 'http://localhost:8088',
  paydayUrl                 : 'http://localhost:8088',
  smeUrl                    : 'http://localhost:8088',
  oddUrl                    : 'http://localhost:8089',
  reportPath                : 'crashReports',
  analyticLogTestUrl        : 'http://159.65.142.103:8000/getlog2/',
  analyticLogTestUrlEnable  : 'Y',
  analyticLogEventCategory  : 'COMMON_AUTHENTICATION',
  analyticLogGAID           : 'UA-130407358-1',
  emailService: {
    SME: 'http://localhost:8080/sendEmailSME',
    KPL: 'http://localhost:8080/sendEmail',
    PAYDAY: 'http://localhost:8080/sendEmailPayDay',
    GRAB: 'http://localhost:8080/sendEmailGrabLending'
  },
  consentService: {
    SME: 'http://localhost:8080/confirmSME',
    KPL: 'http://localhost:8080/confirm',
    PAYDAY: 'http://localhost:8080/confirmPayDay',
    GRAB: 'http://localhost:8080/confirmGrabLending'
  }
};

const sitConfigUrl = {
  kPlusLegacyUrl            : process.env.REACT_APP_ENV_KPLUS_LEGACY_URL,
  kPlusLegacyJSUrl          : process.env.REACT_APP_ENV_KPLUS_LEGACY_JS_URL,
  commonUrl                 : process.env.REACT_APP_ENV_COMMON_URL,
  logUrl                    : process.env.REACT_APP_ENV_LOG_URL,
  baseUrl                   : process.env.REACT_APP_ENV_BASE_URL,
  commonJsUrl               : process.env.REACT_APP_ENV_COMMON_JS,
  reportUrl                 : process.env.REACT_APP_ENV_REPORT,
  grabUrl                   : process.env.REACT_APP_ENV_GRAB_URL,
  kplUrl                    : process.env.REACT_APP_ENV_KPL_URL,
  paydayUrl                 : process.env.REACT_APP_ENV_PAY_DAY_URL,
  smeUrl                    : process.env.REACT_APP_ENV_SME_URL,
  oddUrl                    : process.env.REACT_APP_ENV_ODD_JS_URL,
  reportPath                : 'crashReports',
  analyticLogTestUrl        : process.env.REACT_APP_ENV_ANALYTICREPORT,
  analyticLogTestUrlEnable  : process.env.REACT_APP_ENV_ANALYTICREPORTENABLE,
  analyticLogEventCategory  : 'COMMON_AUTHENTICATION',
  analyticLogGAID           : process.env.REACT_APP_ENV_ANALYTICGAID,
  emailService: {
    SME: process.env.REACT_APP_ENV_SME_EMAIL_URL,
    KPL: process.env.REACT_APP_ENV_KPL_EMAIL_URL,
    PAYDAY: process.env.REACT_APP_ENV_PAY_DAY_EMAIL_URL,
    GRAB: process.env.REACT_APP_ENV_GRAB_EMAIL_URL
  },
  consentService: {
    SME: process.env.REACT_APP_ENV_SME_CONSENT_URL,
    KPL: process.env.REACT_APP_ENV_KPL_CONSENT_URL,
    PAYDAY: process.env.REACT_APP_ENV_PAY_DAY_CONSENT_URL,
    GRAB: process.env.REACT_APP_ENV_GRAB_CONSENT_URL
  }
};

const currentEnv = process.env.REACT_APP_ENV;
const config = (currentEnv === 'SIT' || currentEnv === 'LOCAL_SIT') ? sitConfigUrl : localConfigUrl;

export default config;
