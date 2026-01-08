/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';

const useMultipleApiCall = async (apiFunctions: any) => {
  try {
    const responses = await Promise.all(
      apiFunctions.map((apiFn: any) => apiFn),
    );
    return responses;
  } catch (error: any) {
    throw new Error('Error calling APIs: ' + error.message);
  }
};

export default useMultipleApiCall;
