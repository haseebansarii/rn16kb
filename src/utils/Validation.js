import {Platform} from 'react-native';
import * as yup from 'yup';

const EmailvalidationSchema = yup.object({
  email: yup
    .string()
    .label('email')
    .email('Please enter valid email ')
    .required('Email is required'),
});
const PasswordvalidationSchema = yup.object({
  password: yup.string().label('password').required('Password is required'),
});
const PasswordMatchValidationSchema = yup.object().shape({
  currPassword: yup
    .string()
    .label('currPassword')

    .required('Current password is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPasswordMatchValidationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  // .matches(
  //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //   'Password must contain at least one letter, one number, and one special character',
  // ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const OTPValidationSchema = yup.object({
  otpCode: yup.string().label('otpCode').required('OTP code is required'),
});
const CreateAccountSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  // userName: yup.string().required('Username is required'),
  phone: yup
    .string()
    // .matches(/^\d{10}$/, 'Invalid phone number format')
    .required('Contact number is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});
const UserPersonalDetailSchema = yup.object({
  // date_of_birth: yup.string().label('date_of_birth'),
  // .required('Date of birth is required'),
  // gender: yup.string().label('gender').required('Gender is required'),
  // address: yup.string().label('address').required('Address is required'),
  //  yup.object().shape({
  //   label: yup.string().required(),
  //   value: yup.string().required(),
  // }),
  // nz_driver_license: yup.string().label('nz_driver_license'),
  // driver_licence_no: yup.string().label('driver_licence_no'),
  // card_version_no: yup.string().label('card_version_no'),
  // is_licence_verified: yup.string().label('is_licence_verified'),
  // country: yup.string().label('country'),
  // passport_number: yup.string().label('passport_number'),
  // .required('Passport number is required'),
  // drive_license: yup
  //   .string()
  //   .label('drive_license')
  //   .required('License is required'),
});
const ProductNoteSchema = yup.object({
  note: yup.string().label('note').required('Write something first'),
});
const ContactUsSchema = yup.object({
  first_name: yup
    .string()
    // .label('first_name')
    .required('First name is required'),
  last_name: yup.string().label('last_name').required('Last name is required'),
  email: yup
    .string()
    .label('email')
    .email('Please enter valid email ')
    .required('Email is required'),
  phone: yup
    .string()
    // .matches(/^\d{10}$/, 'Invalid phone number format')
    .required('Contact number is required'),
  detail: yup.string().label('detail').required('Please type a message'),
});
const AccountSettingSchema = yup.object({
  email: yup
    .string()
    .label('email')
    .email('Please enter valid email ')
    .required('Email is required'),
  first_name: yup
    .string()
    .label('first_name')
    .required('First name is required')
    .test('is-valid-name', 'First name cannot be empty or spaces', value => {
      return value && value.trim() !== '';
    }),
  last_name: yup
    .string()
    .label('last_name')
    .required('Last name is required')
    .test('is-valid-name', 'Last name cannot be empty or spaces', value => {
      return value && value.trim() !== '';
    }),
  // address: yup.string().label('address'),
  // .required('Address is required')
  // .test('is-valid-name', 'Address cannot be empty or spaces', value => {
  //   return value && value.trim() !== '';
  // }),
  // username: yup.string().label('username'),
  // .required('Username is required')
  // .test('is-valid-name', 'Username cannot be empty or spaces', value => {
  //   return value && value.trim() !== '';
  // })
  phone: yup
    .string()
    // .matches(/^\d{10}$/, 'Invalid phone number format')
    .required('Contact number is required')
    .test(
      'is-valid-name',
      'Contact number cannot be empty or spaces',
      value => {
        return value && value.trim() !== '';
      },
    ),
  gender: yup.string().label('gender'),
  // driver_licence_no: yup.string().label('gender'),
  // card_version_no: yup.string().label('card_version_no'),
});

const BrandingSchema = yup.object({
  name: yup.string().label('name').required('Name is required'),
  email: yup
    .string()
    .label('email')
    .email('Please enter valid email ')
    .required('Email is required'),
});

const AgentSchema = yup.object({
  first_name: yup
    .string()
    .label('first_name')
    .required('First name is required'),
  last_name: yup.string().label('last_name').required('Last name is required'),
});

const FinanceSchema = yup.object({
  name: yup.string().label('name').required('Name is required'),
  email: yup
    .string()
    .label('email')
    .email('Please enter valid email ')
    .required('Email is required'),
  estimated_interest_rate: yup
    .number()
    .typeError('Estimated interest rate must be a number')
    .min(0, 'Minimum is 0')
    .max(100, 'Maximum is 100')
    .required('Estimated interest rate is required'),
  maximum_yearly_terms: yup
    .number()
    .typeError('Maximum yearly terms must be a number')
    .min(0, 'Minimum is 0')
    .required('Maximum yearly terms is required'),
  minimum_deposit: yup
    .number()
    .typeError('Minimum deposit must be a number')
    .min(0, 'Minimum is 0')
    .required('Minimum deposit is required'),
  website_link: yup
    .string()
    .label('website_link')
    .matches(/^https?:\/\/.+/, 'Please enter a valid website URL')
    .required('Website link is required'),
  description: yup.string().label('description'),
  // Image is optional for finance; allow null/undefined values
  image: yup.mixed().nullable().notRequired(),
});

const VehicalForSaleSchema = yup.object({
  numberPlat: yup.string().label('numberPlat'),
  // .required('Enter your number plate or VIN'),
});

const VehicalAutomaticallySchema = yup.object({
  title: yup.string().label('title').required('Title is required'),
  kilometers: yup
    .string()
    .label('kilometers')
    .required('kilometers is required'),
  askingPrice: yup
    .string()
    .label('askingPrice')
    .required('AskingPrice is required'),
});

const VehicalManuallySchema = yup.object({
  make: yup.string().label('make').required('Please provide make'),
  model: yup.string().label('model').required('Please provide model'),
  model_detail: yup.string().label('model_detail'),
  import_history: yup.string().label('import_history'),
  body: yup.string().label('body').required('body is required'),
  seats: yup.string().label('seats'),
  doors: yup.string().label('doors'),
  previosu_owner: yup.string().label('previosu_owner'),

  year: yup.string().label('year').required('Please provide year'),
  kilometers: yup
    .string()
    .label('kilometers')
    .required('Please provide kilometers'),

  color: yup.string().label('color'),
  numberPlat_or_vin: yup.string().label('numberPlat_or_vin'),

  images: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string(),
        uri: yup.string(),
        type: yup.string(),
      }),
    )
    .required('Selected up to 10 photos.'),

  title: yup.string().label('title').required('Please provide title'),

  category: yup.string().label('category').required('Please select category'),
  subCatagory: yup
    .string()
    .label('subCatagory')
    .required('Please select subcategory'),

  condition: yup
    .string()
    .label('condition')
    .required('Please select condition'),
  describe_vehical: yup
    .string()
    .label('describe_vehical')
    .required('Description is required'),

  engine_size: yup.string().label('engine_size'),
  transmission: yup.string().label('transmission'),

  fuel_type: yup.string().label('fuel_type'),
  cylinders: yup.string().label('cylinders'),

  // drive_type: yup.string().label('drive_type'),
  // .required('drive_type is required'),

  registration_expiry: yup.string().label('registration_expiry'),
  wof_expiry: yup.string().label('wof_expiry'),
  asking_price: yup.string().label('asking_price'),
  // .required('Price is required'),

  reserve_price: yup.string().label('reserve_price'),

  start_price: yup.string().label('start_price'),
  // .required('Start Price is required'),
  buy_now_price: yup.string().label('buy_now_price'),
  // .required('Buy Now is required'),
  checkbox: yup.string().label('checkbox'),
  pickup_available: yup.string().label('pickup_available'),
  location: yup.object().label('location').shape({
    lat: yup.number(),
    lng: yup.number(),
  }),
  paymentOption: yup.string().label('paymentOption'),
  // .required('Please select payment'),

  startDate: yup.string().label('startDate').required('Start Date is required'),

  endDate: yup.string().label('endDate').required('End Date is required'),

  closingTime: yup
    .string()
    .label('closingTime')
    .required('End Time is required'),
  show_number: yup.string().label('show_number'),
  shipping: yup.string().label('shipping'),
});

const ItemForSaleSchema = yup.object({
  images: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string(),
        uri: yup.string(),
        type: yup.string(),
      }),
    )
    .required('Selected up to 10 photos.'),

  title: yup.string().label('title').required('Please provide title'),
  catagory: yup.string().label('catagory').required('Please select category'),
  subCatagory: yup
    .string()
    .label('subCatagory')
    .required('Please select subcategory'),
  make: yup.string().label('make'),
  model: yup.string().label('model'),
  condition: yup
    .string()
    .label('condition')
    .required('Please select condition'),

  //fixed price removes these fields
  start_price: yup.string().label('start_price'),
  // .required('Start Price is required'),
  reserve_price: yup.string().label('reserve_price'),

  buy_now_price: yup.string().label('buy_now_price'),
  // .required('Buy Now is required'),

  //until here

  desc: yup.string().label('desc').required('Description is required'),
  paymentOption: yup.string().label('paymentOption'),
  // .required('Select payment method is required'),
  location: yup.string().label('location'),

  //auction removes this field
  fixed_price_offer: yup.string().label('fixed_price_offer'),
  //until here

  startDate: yup.string().label('startDate'),
  // .required('Start Date is required'),
  endDate: yup.string().label('endDate'),
  // .required('End Date is required'),
  closingTime: yup.string().label('closingTime'),
  // .required('End Time is required'),
  shipping: yup
    .object()
    .shape({
      amount: yup.number().nullable(),
      description: yup.string().nullable(),
      option_name: yup.string().required('Option name is required'),
      url: yup.string().nullable(),
      value: yup.string().required('Value is required'),
    })
    .required('Shipping is required'),
  // shipping: yup.string().label('shipping').required('Shipping is required'),

  make_an_offer: yup.string().label('make_an_offer'),
  show_number: yup.string().label('show_number'),
  pickup_available: yup.string().label('pickup_available'),
  location: yup.object().label('location').shape({
    lat: yup.number(),
    lng: yup.number(),
  }),
});

const houseForRentSchema = yup.object({
  images: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string(),
        uri: yup.string(),
        type: yup.string(),
      }),
    )
    .required('Selected up to 10 photos.'),
  youtubeLink: yup.string().label('youtubeLink'),
  threeDLink: yup.string().label('threeDLink'),
  title: yup.string().label('title').required('Please provide title'),
  category: yup.string().label('category').required('Please select category'),
  subCatagory: yup
    .string()
    .label('subCatagory')
    .required('Please select subcategory'),
  condition: yup
    .string()
    .label('condition')
    .required('Please select condition'),

  aboutProperty: yup
    .string()
    .label('aboutProperty')
    .required('Description is required'),
  streetNo: yup
    .string()
    .label('streetNo')
    .required('Please provide street number'),
  unit: yup.string().label('unit').required('Please provide unit number'),
  streetName: yup
    .string()
    .label('streetName')
    .required('Please provide street name'),
  region: yup.string().label('region').required('Please provide region'),
  district: yup.string().label('district').required('Please provide district'),
  suburb: yup.string().label('suburb').required('Please provide suburb'),

  bedrooms: yup
    .string()
    .label('bedrooms')
    .required('Please provide no. of bedrooms'),
  bathrooms: yup
    .string()
    .label('bathrooms')
    .required('Please provide no. of bathrooms'),
  separateToilets: yup.string().label('separateToilets'),
  ensuiteBathrooms: yup.string().label('ensuiteBathrooms'),
  livingAreas: yup
    .string()
    .label('livingAreas')
    .required('Please provide no. of living areas'),
  studies: yup
    .string()
    .label('studies')
    .required('Please provide no. of studies'),
  garageParking: yup.string().label('garageParking'),
  offStreetParking: yup.string().label('offStreetParking'),
  additionalDetailparking: yup.string().label('additionalDetailparking'),
  rentPerWeek: yup.string().label('rentPerWeek'),
  // .required('This field is required'),
  dateAvaileble: yup.string().label('dateAvaileble'),
  // .required('Please provide date available'),
  listingDuration: yup.string().label('listingDuration'),
  // .required('Listing duration is required'),
  mobile: yup.string().label('mobile'),
  home: yup.string().label('home'),
  bestContactTime: yup.string().label('bestContactTime'),
  areYouRegisteredAgent: yup.string().label('areYouRegisteredAgent'),
  yourName: yup.string().label('yourName'),
  // .required('Please provide agent name'),
  agencyName: yup.string().label('agencyName'),
  // .required('Please provide agency name'),

  pets: yup.string().label('pets'),
  smokers: yup.string().label('smokers'),
  furnishings: yup.string().label('furnishings'),
  amenities: yup.string().label('amenities'),
  yourIdealTenants: yup.string().label('yourIdealTenants'),

  paymentOption: yup.string().label('paymentOption'),
  // .required('Select Payment is required'),
  startDate: yup.string().label('startDate'),
  endDate: yup.string().label('endDate'),
  closingTime: yup.string().label('closingTime'),
  show_number: yup.string().label('show_number'),
});

const FeedBackProductSchema = yup.object({
  feedback: yup.string().label('feedback'),
  // .required('Please provide your feedback'),
});
export {
  EmailvalidationSchema,
  CreateAccountSchema,
  ContactUsSchema,
  ItemForSaleSchema,
  FeedBackProductSchema,
  VehicalManuallySchema,
  VehicalAutomaticallySchema,
  VehicalForSaleSchema,
  AccountSettingSchema,
  BrandingSchema,
  AgentSchema,
  FinanceSchema,
  ProductNoteSchema,
  OTPValidationSchema,
  UserPersonalDetailSchema,
  PasswordvalidationSchema,
  PasswordMatchValidationSchema,
  ResetPasswordMatchValidationSchema,
  houseForRentSchema,
};
