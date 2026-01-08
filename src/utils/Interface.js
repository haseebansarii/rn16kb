const EmailInterface = {
  email: '',
};
const PasswordInterface = {
  password: '',
};
const ResetPasswordInterface = {
  password: '',
  confirmPassword: '',
};
const OTPInterface = {
  otpCode: '',
};
const CreateAccountInterface = {
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  phone: '',
  password: '',
  confirmPassword: '',
};
const UserPersonalDetail = {
  date_of_birth: '',
  gender: '',
  address: '',
  passport_number: '',
  nz_driver_license: null,
  driver_licence_no: null,
  card_version_no: null,
  is_licence_verified: false,
  country: null,
  // drive_license: '',
};
export const ProductNote = v => {
  return {
    note: v?.note,
  };
};
const ContactUs = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  detail: '',
};
const AccountSetting = {
  name: '',
  username: '',
  phone: '',
  email: '',
  gender: '',
  address: '',
};

export const ItemForSaleInterface = v => {
  // console.log('v===========', JSON.stringify(v.fixed_price_offer));
  return {
    images: [{name: '', uri: '', type: ''}],
    title: v?.title,
    catagory: '',
    subCatagory: '',
    make: v?.make,
    model: v?.model,
    start_price: v?.start_price,
    reserve_price: v?.reserve_price,
    buy_now_price: v?.buy_now_price,
    desc: v?.desc,
    location: {
      lat: '',
      lng: '',
    },
    fixed_price_offer: v?.fixed_price_offer,
    condition: '',
    paymentOption: '',
    startDate: '',
    endDate: '',
    closingTime: '',
    period: '',
    shipping: '',
    make_an_offer: v?.make_an_offer,
    show_number: v?.show_number,
    pickup_available: v?.pickup_available,
  };
};

const VehicalForSale = {
  numberPlat: '',
  // numberPlat: 'W0L0JBF68Y7051756',
  // numberPlat: 'LRW3F7FSXPC763727',
};

const VehicalAutomatically = {
  title: '',
  kilometers: '',
  askingPrice: '',
};
export const VehicalManually = v => {
  return {
    make: v?.make,
    model: v?.model,
    model_detail: '',
    import_history: '',
    body: v?.body,
    seats: v?.no_of_seats,
    doors: '',
    previosu_owner: '',
    year: v?.year,
    kilometers: '',
    color: v?.color,
    numberPlat_or_vin: v?.numberPlat_or_vin,
    images: [{name: '', uri: '', type: ''}],
    title: '',
    category: '',
    subCatagory: '',
    condition: '',
    describe_vehical: '',
    engine_size: v?.engine_size,
    transmission: '',
    fuel_type: v?.fuel_type,
    cylinders: '',
    // drive_type: '',
    registration_expiry: '',
    wof_expiry: '',
    asking_price: '',
    reserve_price: '',
    start_price: '',
    buy_now_price: '',
    checkbox: '',
    pickup_available: '',
    location: {
      lat: '',
      lng: '',
    },
    paymentOption: '',
    startDate: '',
    endDate: '',
    closingTime: '',
    show_number: '',
    shipping: '',
  };
};
const FeedBackProduct = {
  feedback: '',
};

const houseForSale = {
  images: [{name: '', uri: '', type: ''}],
  youtubeLink: '', //v?.youtubeLink,
  threeDLink: '', //v?.threeDLink,

  category: '', //v?.category,
  subCatagory: '', //v?.subCatagory,
  condition: '', //v?.condition,
  title: '', //v?.title,
  aboutProperty: '', //v?.aboutProperty,
  streetNo: '', //v?.streetNo,
  unit: '', //v?.unit,
  streetName: '', //v?.streetName,
  region: '', //v?.region,
  district: '', //v?.district,
  suburb: '', //v?.suburb,
  bedrooms: '', //v?.bedrooms,
  bathrooms: '', //v?.bathrooms,
  separateToilets: '', //v?.separateToilets,
  ensuiteBathrooms: '', //v?.ensuiteBathrooms,
  livingAreas: '', //v?.livingAreas,
  studies: '', //v?.studies,
  garageParking: '', //v?.garageParking,
  offStreetParking: '', //v?.offStreetParking,
  additionalDetailparking: '', //v?.additionalDetailparking,
  rentPerWeek: '', //v?.rentPerWeek,
  dateAvaileble: '', //v?.dateAvaileble,
  listingDuration: '', //v?.listingDuration,
  mobile: '', //v?.mobile,
  home: '', //v?.home,
  bestContactTime: '', //v?.bestContactTime,
  areYouRegisteredAgent: '', //v?.areYouRegisteredAgent,
  yourName: '', //v?.yourName,
  agencyName: '', //v?.agencyName,
  pets: '', //v?.pets,
  smokers: '', //v?.smokers,
  furnishings: '', //v?.furnishings,
  amenities: '', //v?.amenities,
  yourIdealTenants: '', //v?.yourIdealTenants,
  paymentOption: '', //v?.paymentOption,
  startDate: '', //v?.startDate,
  endDate: '', //v?.closingDate,
  closingTime: '', //v?.closingTime,
  show_number: '', //v?.show_number,
};

export {
  EmailInterface,
  OTPInterface,
  VehicalAutomatically,
  // VehicalManually,
  VehicalForSale,
  // ProductNote,
  AccountSetting,
  ContactUs,
  FeedBackProduct,
  // ItemForSalePro,
  UserPersonalDetail,
  CreateAccountInterface,
  ResetPasswordInterface,
  PasswordInterface,
  houseForSale,
};
