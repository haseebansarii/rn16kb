import {store} from '../../store/store';

export const uploadFileXHR = ({payload, callBack}: any) => {
  const {auth}: any = store?.getState();
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener('readystatechange', function () {
    // console.log('fileupload text==>', this.readyState);
    if (this.readyState === 4) {
      let response;
      response = JSON.parse(this.responseText);
      callBack(response);
    }
  });
  xhr.open('POST', `${process.env.API_URL}upload-image`);
  xhr.setRequestHeader('Authorization', `Bearer ${auth?.token}`);
  xhr.send(payload);
};
