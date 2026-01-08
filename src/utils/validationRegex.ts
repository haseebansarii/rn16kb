export function isEmailValid(email: string) {
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
  // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(email)) {
  //   return true;
  // } else return false;
}

export function isPhoneValid(phone: string) {
  if (/^\+?[0-9][0-9]{7,14}$/.test(phone)) {
    return true;
  } else return false;
}
