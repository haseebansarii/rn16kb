import axios from 'axios';
import {API_URL} from '../../config';

export const axiosUploadImagesMutation = async (
  formData,
  customheaders = {},
) => {
  let url = `${API_URL}upload-image`;

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...customheaders,
    },
  });
  return response;
};
