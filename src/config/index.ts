// let env = 'dev';
// let env = 'stage';
let env = 'prod';

export const dev_url = 'http://127.0.0.1:8080/';
export const stg_url = 'https://isqroll-be-uat.azurewebsites.net/';
export const prod_url = 'https://be.isqroll.co.nz/';
// 'https://isqroll-be-prod-eqcyg0fdhtgshrg3.australiasoutheast-01.azurewebsites.net/';
// export const dev_url = 'http://192.168.100.6:2005/';

export const VITE_FE_STG_URL = 'https://isqroll-fe-uat.azurewebsites.net/';
export const VITE_FE_DEV_URL = 'http://osnz.hopto.org:3061/';
export const VITE_FE_PROD_URL = 'https://isqroll.co.nz/';
// 'https://isqroll-fe-prod-b7bra9bbhvahdka0.australiasoutheast-01.azurewebsites.net/';

export const web_view_url_dev = 'http://osnz.hopto.org:3061/mb/';
export const web_view_url_stage =
  'https://isqroll-fe-uat.azurewebsites.net/mb/';
export const web_view_url_prod = 'https://isqroll.co.nz/mb/';
// 'https://isqroll-fe-prod-b7bra9bbhvahdka0.australiasoutheast-01.azurewebsites.net/mb/';

export const publishable_key_local =
  'pk_test_51Mh32xBFmBJ7rY7Wh9klcvKVKCXYVj2y8xGKmqagGvOffmZbJ7T7Md9cAHLyonKFEsLhfBYqkKxknt71JiX7BeA500blcCWAkT'; // LOCAL

export const publishable_key_dev =
  'pk_test_51OcGoLE1B9CpQsVEIzAAw57lbi4RlVAYc1tq9OYezQekIb3zb7fLo5ofEgvYP5sacDfrx3JTNpAxGYlkDnFBUwhu00z6onUx7K'; //  DEV

export const publishable_key_stg =
  'pk_test_51Ojp40B2ZAfA6YTzrANR9wnxnBmZPK3YxmGRbk7TeNogM3ZSIjjTGKkpItYMWUM7HEXhmMAv4n5kCPn1DbTri8AT0022jcbUWA'; //  STAGE

export const publishable_key_prod =
  'pk_live_51Ojp40B2ZAfA6YTzoZcAXRlFWF0YHmGvHpOtbhylolDTyI2NjCh7iAQztBTTrhUGkTWaEzVpcDA7wNMVCqiceal700O5UTe3wP';

export const GOOGLE_MAP_API_KEY =
  env === 'dev'
    ? 'AIzaSyA7jA5c9W84oOqCCwLwHwEs0TfzL6Nt75o' //outsourcenz new
    : // 'AIzaSyA5ZQ2rKaP4SBeZT2eRVzEupwqPg2Dp7mQ' //outsourcenz old
      'AIzaSyDFJVzmqvRHnt3SOwXTQleg0yRuwcXQM8M'; //isqroll

export const VITE_CARJAM_DEV_API_URL = 'https://test.carjam.co.nz/';
export const VITE_CARJAM_STG_API_URL = 'https://www.carjam.co.nz/';
export const VITE_CARJAM_STG_API_KEY =
  '0960CF7C4A9698AA9101F6C1B677EE9324E83E9B';
export const VITE_CARJAM_DEV_API_KEY =
  'D193B06161BD8D651E1C0FC2255CB554D9C02013';

export const API_URL =
  env == 'dev' ? dev_url : env == 'prod' ? prod_url : stg_url;
export const publishable_key =
  env == 'dev'
    ? publishable_key_dev
    : env == 'prod'
    ? publishable_key_prod
    : publishable_key_stg;
export const CARJAM_API_URL =
  env == 'dev'
    ? VITE_CARJAM_DEV_API_URL
    : env == 'prod'
    ? VITE_CARJAM_STG_API_URL
    : VITE_CARJAM_STG_API_URL;
export const CARJAM_API_KEY =
  env == 'dev'
    ? VITE_CARJAM_DEV_API_KEY
    : env == 'prod'
    ? VITE_CARJAM_STG_API_KEY
    : VITE_CARJAM_STG_API_KEY;
export const FE_URL =
  env == 'dev'
    ? VITE_FE_DEV_URL
    : env == 'prod'
    ? VITE_FE_PROD_URL
    : VITE_FE_STG_URL;

export const APP_VERSION = env == 'prod' ? '10' : '2';
export const APP_VERSION_ANDROID = env == 'prod' ? '7' : '2';
export const APP_VERSION_IOS = env == 'prod' ? '5' : '2';
export const envType = env;
