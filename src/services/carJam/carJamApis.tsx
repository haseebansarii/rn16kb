import axios from 'axios';
import {CARJAM_API_KEY, CARJAM_API_URL} from '../../config';

export const getCarDetailsFromVin = vinOrPlate => {
  let url = `${CARJAM_API_URL}api/car/?key=${CARJAM_API_KEY}&f=json&basic=1&translate=1&plate=${vinOrPlate}`;
  return axios.get(url);
};
export const verifyDriverLicence = (driverLicenceNo, cardVersionNo) => {
  return axios.get(
    `${CARJAM_API_URL}api/dlvs/?key=${CARJAM_API_KEY}&f=json&driver_licence_no=${driverLicenceNo}&card_version_no=${cardVersionNo}`,
  );
};
