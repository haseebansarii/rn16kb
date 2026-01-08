import {t} from 'i18next';

const genderData = [
  {key: 'Male', value: 'man'},
  {key: 'Female', value: 'woman'},
  {key: 'Gender Diverse', value: 'gender_diverse'},
];

const locationRadiusData = [
  {key: '10 Kilometers', value: '10'},
  {key: '30 Kilometers', value: '30'},
  {key: '50 Kilometers', value: '50'},
  {key: '100 Kilometers', value: '100'},
  {key: '200 Kilometers', value: '200'},
];

const subscriptionData = [
  {
    title: 'entry',
    subTitle: '14 Days Free Trail',
    price: '$0.0',
  },
  {
    title: 'Basic',
    subTitle: 'Entry Package',
    price: '$9.00',
  },
  {
    title: 'Standard',
    subTitle: 'Standard Package',
    price: '$14.00',
  },
  {
    title: 'Business',
    subTitle: 'Business package',
    price: '$136.00',
  },
];
const subscriptionDetailMonthly = [
  {
    text: 'Buy (up to unlimited buys per month)',
  },
  {
    text: 'Sell (1 sells per month) ',
  },
  {
    text: 'Unlimited Bids',
  },

  {
    text: 'No Transaction fee',
  },
  {
    text: 'Every Reminder',
  },
  {
    text: 'Unlimited Watchlist',
  },
];
const subscriptionDetailYearly = [
  {
    text: 'Buy (up to unlimited buys per year)',
  },
  {
    text: 'Sell (up to 12 sells per year) ',
  },
  {
    text: 'Unlimited Bids',
  },
  {
    text: 'No Transaction fee',
  },
  {
    text: 'Every Reminder',
  },
  {
    text: 'Unlimited Watchlist',
  },
];
const ChatList = [
  {
    key: '1',
    name: 'Chris',
    rating: 4,
  },
  {
    key: '2',
    name: 'Mark',
    rating: 5,
  },
  {
    key: '3',
    name: 'John',
    rating: 2,
  },
  {
    key: '4',
    name: 'Maria',
    rating: 1,
  },
  {
    key: '5',
    name: 'Leo',
    rating: 5,
  },
  {
    key: '6',
    name: 'Hulk',
    rating: 2,
  },
  {
    key: '7',
    name: 'Taha',
    rating: 4,
  },
];
const ColorsArray = [
  {color: '#12B6DD'},
  {color: '#EE1111'},
  {color: '#09C47A'},
];

const IWatchList = [
  {
    image:
      'https://cdn.pixabay.com/photo/2023/11/16/10/26/casio-8392121_1280.jpg',
    description: 'HP Laptop Intel Core i7215U, 4GB',
    bought: false,
    showButtons: true,
    productEnded: true,
  },
  {
    image:
      'https://cdn.pixabay.com/photo/2023/11/16/10/26/casio-8392121_1280.jpg',
    description: 'HP Laptop Intel Core i7215U, 4GB',
    bought: false,
    showButtons: true,
    productEnded: false,
  },
  {
    image:
      'https://cdn.pixabay.com/photo/2023/11/16/10/26/casio-8392121_1280.jpg',
    description: 'HP Laptop Intel Core i7215U, 4GB',
    bought: false,
    showButtons: true,
    productEnded: true,
  },
  {
    image:
      'https://cdn.pixabay.com/photo/2023/11/16/10/26/casio-8392121_1280.jpg',
    description: 'HP Laptop Intel Core i7215U, 4GB',
    bought: true,
    showButtons: false,
    productEnded: false,
  },
  {
    image:
      'https://cdn.pixabay.com/photo/2023/11/16/10/26/casio-8392121_1280.jpg',
    description: 'HP Laptop Intel Core i7215U, 4GB',
    bought: true,
    showButtons: true,
    productEnded: true,
  },
  {
    image:
      'https://cdn.pixabay.com/photo/2023/11/16/10/26/casio-8392121_1280.jpg',
    description: 'HP Laptop Intel Core i7215U, 4GB',
    bought: true,
    showButtons: false,
    productEnded: false,
  },
];
const Privacy_Policy = [
  {
    title: ``,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `What Personal Information About Customers Does iSqroll Collect?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
  },
  {
    title: `For What Purposes Does iSqroll Use Your Personal Information?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `What About Cookies and Other Identifiers?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `Does iSqroll Share Your Personal Information?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `How Secure Is Information About Me?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `What About Advertising?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `What Information Can I Access?`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: 'What Choices Do I Have?',
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: 'Are Children Allowed to Use iSqroll Services?',
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
];
const TermsCondition = [
  {
    title: ``,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `Please read these conditions carefully.`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
  },
  {
    title: `PRIVACY`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `ELECTRONIC COMMUNICATIONS`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `COPYRIGHT`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `TRADEMARKS`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `LICENSE AND ACCESS`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `YOUR ACCOUNT`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: 'REVIEWS, COMMENTS,COMMUNICATIONS, AND OTHER CONTENT',
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: 'RETURNS, REFUNDS AND TITLE',
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
];
const AboutUs = [
  {
    title: ``,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `Our Mission`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
  },
  {
    title: `How We Work`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
  {
    title: `How We Work`,
    description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text,`,
  },
];

const faqs_data = [
  {
    question: 'How to update my availability and rate?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution.',
    created_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    deleted_at: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    updated_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
  },
  {
    question: 'I didn’t receive my payment yet, what should i do?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution.',
    created_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    deleted_at: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    updated_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
  },
  {
    question: 'How to update my availability and rate?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution.',
    created_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    deleted_at: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    updated_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
  },
  {
    question: 'How to update my availability and rate?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution.',
    created_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    deleted_at: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    updated_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
  },
  {
    question: 'How to update my availability and rate?',
    answer:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution.',
    created_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    deleted_at: 'Wed Jul 26 2023 11:55:16 GMT+0500',
    updated_by: 'Wed Jul 26 2023 11:55:16 GMT+0500',
  },
];
const Notification = [
  {
    id: 1,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: true,
  },
  {
    id: 2,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: false,
  },
  {
    id: 3,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: true,
  },
  {
    id: 4,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: false,
  },
  {
    id: 5,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: true,
  },
  {
    id: 6,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: false,
  },
  {
    id: 7,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: true,
  },
  {
    id: 8,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: false,
  },
  {
    id: 9,
    text: 'You have been out-bid on “32 inch gaming monitor” listing',
    read: true,
  },
];
const FeedBackArray = [
  {
    text: 'Positive Feedback',
  },
  {
    text: 'Neutral Feedback',
  },
  {
    text: 'Negative Feedback',
  },
];
const RatingReviews = [
  {
    id: 1,
    name: 'Chris Jv',
    commenterName: 'Cristian',
    occupation: 'Seller',
    productName: 'HP Laptop Intel Core i3-215U',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 1,
    name: 'Chris Jv',
    commenterName: 'Cristian',
    productName: 'HP Laptop Intel Core i3-215U',
    occupation: 'Buyer',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 1,
    name: 'Chris Jv',
    commenterName: 'Cristian',
    occupation: 'Seller',
    productName: 'HP Laptop Intel Core i3-215U',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];
const Report = [
  {
    title: 'The review is for a different business',
  },
  {
    title: 'The review is spam or scam',
  },
  {
    title: 'The review is defamation',
  },
  {
    title: 'The review is false or contains false information',
  },
  {
    title: 'Other',
  },
];

const Catagories = [
  {
    title: t('common:market_hub'),
    image: 'markethub',
  },
  {
    title: t('common:automotive'),
    image: 'automitive',
  },
  {
    title: t('common:property'),
    image: 'property',
  },
  {
    title: t('common:occupations'),
    image: 'occupations',
  },
  {
    title: t('common:fashion'),
    image: 'fashion',
  },
  {
    title: t('common:kids'),
    image: 'kids',
  },
  {
    title: t('common:furniture'),
    image: 'furniture',
  },
  {
    title: t('common:fitness'),
    image: 'fitness',
  },
  {
    title: t('common:others'),
    image: 'others',
  },
];
const FixedPriceOfferFilters = [
  // {
  //   title: t('common:all'),
  // },

  {
    _id: '664c582744b597f145dc48e8',
    key: 'location',
    title: 'Location',
  },
  {
    _id: '664c582744b597f145dc48ea',
    key: 'filter_search',
    title: 'Filter Search',
  },
  {
    _id: '664c582744b597f145dc48ec',
    key: 'new_used',
    title: 'New Used',
  },
  {
    _id: '664c582744b597f145dc48ee',
    key: 'shipping',
    title: 'Shipping',
  },
  {
    _id: '664c582744b597f145dc48f0',
    key: 'price',
    title: 'Price',
  },
  {
    _id: '664c582744b597f145dc48f2',
    key: 'end_date',
    title: 'End Date',
  },
];

const AutomotiveFilters = [
  {
    _id: 'automotive_make',
    key: 'make',
    title: 'Make',
  },
  {
    _id: 'automotive_model',
    key: 'model',
    title: 'Model',
  },
  {
    _id: 'automotive_location',
    key: 'location',
    title: 'Location',
  },
  {
    _id: 'automotive_year',
    key: 'year',
    title: 'Year',
  },
  {
    _id: 'automotive_price',
    key: 'price',
    title: 'Price',
  },
  {
    _id: 'automotive_body_style',
    key: 'body_style',
    title: 'Body Style',
  },
  {
    _id: 'automotive_fuel_type',
    key: 'fuel_type',
    title: 'Fuel Type',
  },
  {
    _id: 'automotive_odometer',
    key: 'odometer',
    title: 'Odometer',
  },
  {
    _id: 'automotive_transmission',
    key: 'transmission',
    title: 'Transmission',
  },
  {
    _id: 'automotive_doors',
    key: 'number_of_doors',
    title: 'Number of Doors',
  },
  {
    _id: 'automotive_seats',
    key: 'number_of_seats',
    title: 'Number of Seats',
  },
  {
    _id: 'automotive_filter_search',
    key: 'filter_search',
    title: 'Filter Search',
  },
];

// Vehicle body styles
const vehicleBodyStyles = [
  'Sedan',
  'Hatchback',
  'SUV',
  'Wagon',
  'Ute',
  'Van',
  'Coupe',
  'Convertible',
  'Pickup',
  'Truck',
  'Motorcycle',
  'Other',
];

// Vehicle fuel types
const vehicleFuelTypes = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in Hybrid',
  'LPG',
  'Other',
];

// Transmission types
const transmissionTypes = ['All', 'Automatic', 'Manual'];

// Price options (1k to 200k)
const priceOptions = [
  'Any',
  1000,
  2000,
  3000,
  4000,
  5000,
  7500,
  10000,
  12500,
  15000,
  20000,
  25000,
  30000,
  35000,
  40000,
  50000,
  60000,
  70000,
  80000,
  90000,
  100000,
  150000,
  200000,
];

// Year options (1920 to current year)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1920; year--) {
    years.push(year.toString());
  }
  return years;
};

// Door options
const doorOptions = ['Any', '1', '2', '3', '4', '5'];

// Seat options
const seatOptions = ['Any', '1', '2', '3', '4', '5', '6', '7', '8'];
const SortByFixedPrice = [
  {
    title: t('common:best_match'),
  },
  {
    title: t('common:ending_soonest'),
  },
  {
    title: t('common:newly_listed'),
  },
  {
    title: t('common:lowest_first'),
  },
  {
    title: t('common:highest_first'),
  },
  {
    title: t('common:nearest_first'),
  },
  {
    title: t('common:fewest_first'),
  },
];
const itemTypeData = [
  {
    id: 0,
    title: t('common:all'),
  },
  {
    id: 1,
    title: t('common:fixed_price'),
  },
  {id: 2, title: t('common:biding')},
];
const newUsedItem = [
  {
    id: 0,
    title: t('common:all'),
  },
  {
    id: 1,
    title: t('common:new_item'),
  },
  {id: 2, title: t('common:used_item')},
];
const shippingData = [
  {
    id: 0,
    title: t('common:free_shipping'),
  },
  {id: 1, title: t('common:pickup_availeble')},
];

const shipping_methods = [
  {
    option_name: 'Free shipping within New Zealand',
    value: 'free_shipping',
    amount: null,
  },
  {
    option_name: 'Specify Shipping Costs',
    value: 'specify_costs',
    amount: null,
  },
  {
    option_name: 'Pickup',
    value: 'pickup',
    amount: null,
  },
  {
    option_name: 'To be arranged',
    value: 'dont_know',
    amount: null,
  },
];
const shipping_methods_vehicle = [
  {
    option_name: 'Pickup',
    value: 'pickup',
    amount: null,
  },
  {
    option_name: 'To be arranged',
    value: 'dont_know',
    amount: null,
  },
];

const WhatAreYouSelling = [
  {
    title: t('common:item_for_sale'),
    description: t('common:item_for_sale_description'),
    image: 'item_for_sale',
  },
  {
    title: t('common:vehicle_for_sale'),
    description: t('common:vehicle_for_sale_description'),
    image: 'vehical_for_sale',
  },
  {
    title: t('common:property_for_sale_rent'),
    description: t('common:property_for_sale_rent_description'),
    image: 'property_for_sale',
  },
];

const ProfileList = [
  {
    title: 'Selling',
    data: [
      {
        name: 'iSell',
        icon: 'equal',
        navigation: 'IChat',
      },
    ],
  },
  {
    title: 'Buying',
    data: [
      {
        name: 'iBuy',
        icon: 'iBuyIcon',
      },
      {
        name: 'iWatch',
        icon: 'eyeOpen',
      },
      {
        name: 'Fixed Price Offers',
        icon: 'fixed',
        navigation: 'FixedPriceOffer',
      },
      {
        name: 'iWon / iLost',
        icon: 'cup',
      },
      {
        name: 'irate',
        icon: 'iRate',
      },
    ],
  },
  {
    title: 'Profile',
    data: [
      {
        name: 'iChat',
        icon: 'message',
        navigation: 'IChat',
      },
      {
        name: 'Notifications',
        icon: 'notification',
        navigation: 'Notification',
      },
      {
        name: 'Account Settings',
        icon: 'setting',
        navigation: 'AccountSetting',
      },
      {
        name: 'Reports',
        icon: 'report',
        navigation: 'ReportContainer',
      },
    ],
  },

  {
    title: 'Information',
    data: [
      {
        name: 'About Us',
        icon: 'about',
        navigation: 'AboutUs',
      },
      {
        name: 'Faqs',
        icon: 'faq',
        navigation: 'FaqsContainer',
      },
      {
        name: 'Privacy Policy',
        icon: 'privacy',
        navigation: 'PrivacyPolicy',
      },
      {
        name: 'Terms & Condition',
        icon: 'terms',
        navigation: 'TermsCondition',
      },
      {
        name: 'Contact Us',
        icon: 'contact',
        navigation: 'ContactUs',
      },
    ],
  },
];

export {
  genderData,
  ChatList,
  WhatAreYouSelling,
  shipping_methods,
  shipping_methods_vehicle,
  SortByFixedPrice,
  FixedPriceOfferFilters,
  AutomotiveFilters,
  vehicleBodyStyles,
  vehicleFuelTypes,
  transmissionTypes,
  priceOptions,
  generateYearOptions,
  doorOptions,
  seatOptions,
  FeedBackArray,
  shippingData,
  ProfileList,
  TermsCondition,
  newUsedItem,
  Privacy_Policy,
  ColorsArray,
  AboutUs,
  Report,
  itemTypeData,
  Catagories,
  faqs_data,
  subscriptionData,
  // subscriptionDetail,
  subscriptionDetailMonthly,
  subscriptionDetailYearly,
  IWatchList,
  RatingReviews,
  Notification,
  locationRadiusData,
};

export const categories_list = [
  {name: 'Market Hub', SVG: require('../theme/assets/svg/market_hub.svg')},
  {name: 'Automotive', SVG: require('../theme/assets/svg/automotive.svg')},
  {name: 'Property', SVG: require('../theme/assets/svg/property.svg')},
  {
    name: 'Services & Advertisements',
    SVG: require('../theme/assets/svg/services_and_advertisements.svg'),
  },
  {name: 'Occupations', SVG: require('../theme/assets/svg/occupations.svg')},
  {name: 'Fashion', SVG: require('../theme/assets/svg/fashion.svg')},
  {name: 'Kids', SVG: require('../theme/assets/svg/kids.svg')},
  {name: 'Furniture', SVG: require('../theme/assets/svg/furniture.svg')},
  {name: 'Fitness', SVG: require('../theme/assets/svg/fitness.svg')},
  {name: 'Others', SVG: require('../theme/assets/svg/others.svg')},
];

export const listing_filter_list = [
  'All',
  'Lowest Price',
  'Highest Price',
  'Oldest',
  'Newest',
];

export const product_listing = [
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
  {
    title: 'HP Laptop Intel Core i3',
    closed_on: Date(),
    location: 'Auckland',
    bids: 19,
    starting: 299,
    buy_now: 400,
    rating: 3,
    time: '2 hours',
    product_image: require('../theme/assets/images/product.png'),
    user_image: require('../theme/assets/images/user.png'),
  },
];

export const dropdownCondition = [
  {key: 'Used', value: 'used'},
  {key: 'New', value: 'new'},
];

export const dropdownPaymentOption = [
  {key: 'NZ Bank Deposit', value: 'nz_bank_account'},
  {key: 'Cash', value: 'cash'},
  {key: 'To be arranged', value: 'other'},
];

export const product_details = {
  swiper_imgList: [
    'https://images.unsplash.com/photo-1709065556197-2cbe782878e1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://www.mordeo.org/files/uploads/2016/10/Cute-Angry-Birds-Mobile-Wallpaper.jpg',
    'https://wallpapercave.com/wp/wp2807409.jpg',
    'https://plus.unsplash.com/premium_photo-1681582960531-7b5de57fb276?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ],
  title:
    'HP Laptop Intel Core i7-1215U, 4GB, 256GB SSD, Intel Graphics, 15.6" HD Display,Mate Black Color',
  close_time: new Date(),
  current_bid: 161,
  active_bids: 12,
  starting_price: 170,
  detail: {
    brand: 'LG',
    condition: 'Used - Like New',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
  },
  location: 'Nortshore auckland',
  shipping: {
    text: 'Urban NZ',
    price: 10,
  },
  shipping2: {
    text: 'Rural NZ',
    price: 15,
  },
  payment_option: ['NZ Bank Deposit', 'Cash'],
  seller: {
    name: 'Chris Jav',
    address: '112 Bushroad, Pinehill, Albany Auckland',
  },
  auto_bid_text: `Lorem Ipsum is simply dummy text of printing typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`,
};

export const subscription_points = [
  [
    'Buy (unlimited buys)',
    'Unlimited Bids',
    'No Transaction fee',
    'Every Reminder',
    'Unlimited Watchlist',
  ],
  [
    'Buy (unlimited buys per month)',
    'Sell (1 sells per month)',
    'Unlimited Bids',
    'No Transaction fee',
    'Every Reminder',
    'Unlimited Watchlist',
  ],
  [
    'Buy (unlimited buys per month)',
    'Sell (5 sells per month)',
    'Sell (up to 1 automotive sells per month)',
    'Can use all features in the system',
    'Unlimited Bids',
    'No Transaction fee',
    'Every Reminder',
    'Unlimited Watchlist',
  ],
  [
    'Buy (unlimited buys per month)',
    'Sell (unlimited sells per month)',
    'Sell (unlimited automotive sells per month)',
    'Can use all features in the system',
    'Unlimited Bids',
    'No Transaction fee',
    'Every Reminder',
    'Unlimited Watchlist',
  ],
  [
    'Buy (unlimited buys per month)',
    'Sell (unlimited sells per month)',
    'Sell (unlimited automotive sells per month)',
    'Can use all features in the system',
    'Unlimited Bids',
    'No Transaction fee',
    'Every Reminder',
    'Unlimited Watchlist',
  ],
];
export const MotorCentralData = {
  motorcentral_records: [
    {
      title: 'Daihatsu Hijet TRUCK 2002',
      vehicle_class: 'PassengerVehicle',
      vehicle_class_enum: '10',
      make: 'Daihatsu',
      model: 'Hijet',
      status: 'pending',
      images: [
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-1.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a2',
          created_at: '2024-12-06T20:47:49.771Z',
          updated_at: '2024-12-06T20:47:49.771Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-2.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a3',
          created_at: '2024-12-06T20:47:49.772Z',
          updated_at: '2024-12-06T20:47:49.772Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-3.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a4',
          created_at: '2024-12-06T20:47:49.772Z',
          updated_at: '2024-12-06T20:47:49.772Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-4.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a5',
          created_at: '2024-12-06T20:47:49.772Z',
          updated_at: '2024-12-06T20:47:49.772Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-5.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a6',
          created_at: '2024-12-06T20:47:49.773Z',
          updated_at: '2024-12-06T20:47:49.773Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-6.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a7',
          created_at: '2024-12-06T20:47:49.773Z',
          updated_at: '2024-12-06T20:47:49.773Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-7.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a8',
          created_at: '2024-12-06T20:47:49.773Z',
          updated_at: '2024-12-06T20:47:49.773Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-8.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638a9',
          created_at: '2024-12-06T20:47:49.773Z',
          updated_at: '2024-12-06T20:47:49.773Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-9.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638aa',
          created_at: '2024-12-06T20:47:49.773Z',
          updated_at: '2024-12-06T20:47:49.773Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-10.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638ab',
          created_at: '2024-12-06T20:47:49.773Z',
          updated_at: '2024-12-06T20:47:49.773Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-11.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638ac',
          created_at: '2024-12-06T20:47:49.774Z',
          updated_at: '2024-12-06T20:47:49.774Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-12.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638ad',
          created_at: '2024-12-06T20:47:49.774Z',
          updated_at: '2024-12-06T20:47:49.774Z',
        },
        {
          name: '012ef69d-ff0a-4747-9433-27d84dfe573c-13.jpg',
          created_by: null,
          deleted_at: null,
          _id: '675362f54543aa634c6638ae',
          created_at: '2024-12-06T20:47:49.774Z',
          updated_at: '2024-12-06T20:47:49.774Z',
        },
      ],
      condition: 'used',
      fixed_price_offer: 8990,
      description:
        'Daihatsu Hijet truck\r\nJUMBO SERIES - HIGH ROOF AND LONGER CAB\r\n\r\n660cc Petrol\r\n5 speed manual\r\n4wd at the push of a button\r\nCB Radio\r\nSold with fresh service and new WOF\r\nDeck dimensions 1400 x 1700 plus an extra cubby whole at the front\r\nCarpet has been laid down to preserve deck - not glued down so easily removed.\r\n\r\nON THE ROAD READY TO GO - NO HIDDEN COSTS\r\n\r\nSimilar to Suzuki Carry',
      _id: '675362cd913f96ed4717ac61',
      vehicle_id: '012ef69d-ff0a-4747-9433-27d84dfe573c',
      body: 'Ute',
      color: 'White',
      created_at: '2024-12-06T20:47:09.192Z',
      dealership: 'Palmerston Nth',
      engine_size: '659',
      fuel_type: 'Petrol',
      kilometers: 81583,
      no_of_doors: -1,
      no_of_seats: 2,
      previous_owners: 'Ex-Overseas',
      registration_expiry: '30/04/2024',
      transmission: 'manual',
      updated_at: '2024-12-06T20:47:49.799Z',
      user: '6621f96ab0ea8e53fc9af6b5',
      vin: '7AT04705X23164009',
      year: 2002,
    },
    {
      title: 'MG MGB Roadster 1980',
      vehicle_class: 'PassengerVehicle',
      vehicle_class_enum: '10',
      make: 'MG',
      model: 'MGB',
      status: 'pending',
      images: [
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-1.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5615',
          created_at: '2024-12-06T18:24:23.138Z',
          updated_at: '2024-12-06T18:24:23.138Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-2.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5616',
          created_at: '2024-12-06T18:24:23.138Z',
          updated_at: '2024-12-06T18:24:23.138Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-3.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5617',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-4.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5618',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-5.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5619',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-6.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f561a',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-7.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f561b',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-8.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f561c',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-9.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f561d',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-10.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f561e',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-11.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f561f',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-12.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5620',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-13.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5621',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-14.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5622',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-15.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5623',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-16.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5624',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
        {
          name: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb-17.jpg',
          created_by: null,
          deleted_at: null,
          _id: '67534157d486b756349f5625',
          created_at: '2024-12-06T18:24:23.139Z',
          updated_at: '2024-12-06T18:24:23.139Z',
        },
      ],
      condition: 'used',
      fixed_price_offer: 15650,
      description:
        '1980 MG MGB Roaster\r Imported from the USA and registered in NZ 1987\r \r 1800 twin carb engine\r 4 speed manual with electric overdrive\r Electronic distributor\r New carpets\r Consistent odometer\r Factory decals\r Drives and presents well , Paint work appears to be original and does have some character as to be expected at 44 years old.',
      _id: '6753411d913f96ed4717950c',
      vehicle_id: '1e7cd6bf-9b00-44f3-a2fe-c988698255cb',
      body: 'Convertible',
      color: 'Red',
      created_at: '2024-12-06T18:23:25.264Z',
      dealership: 'Palmerston Nth',
      engine_size: '1800',
      fuel_type: 'Petrol',
      kilometers: 60864,
      no_of_doors: -1,
      no_of_seats: 5,
      previous_owners: 'Ex-Overseas',
      registration_expiry: '04/07/2025',
      transmission: 'manual',
      updated_at: '2024-12-06T18:30:38.628Z',
      user: '6621f96ab0ea8e53fc9af6b5',
      vin: '',
      year: 1980,
    },
  ],
};
