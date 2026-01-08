import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  propertyData: {
    title: '',
    category: '',
    sub_category: '',
    type: 'fixed_price',
    images: [],
    condition: null,
    fixed_price_offer: 0,
    description: '',
    pickup_available: false,
    payment_option: 'other',
    show_phone: false,
    make_an_offer: false,
    listing_type: 'property',
    youtube_video_url: null,
    three_d_tour_url: null,
    street_number: '',
    unit_number: '',
    street_name: '',
    region: '',
    district: '',
    suburb: '',
    no_of_bedrooms: 0,
    no_of_bathrooms: '',
    no_of_separate_toilets: 0,
    no_of_ensuite_bathrooms: 0,
    no_of_living_areas: 0,
    no_of_studies: 0,
    garage_parking: false,
    off_street_parking: false,
    parking_details: '',
    rent_per_week: '',
    date_available: null,

    //  moment(v?.dateAvaileble).format('YYYY-MM-DD'),
    listing_duration: null,
    mobile_number: null,
    home: null,
    best_contact_time: null,
    registered_property_agent: false,
    agent_name: '',
    agency_name: '',
    receive_application_forms: false,
    pets_ok: '',
    smokers_ok: '',
    furnishings_n_whiteware: null,
    amenities_in_area: null,
    ideal_tenants: null,
    start_date: null,
    //  dayjs(startDate).format('YYYY-MM-DD'),
    end_date: null,
    // dayjs(endDate).format('YYYY-MM-DD'),
    end_time: null,
  },
};

export const FormsSlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setPropertyData: (state, {payload}) => {
      state.propertyData = {...state.propertyData, ...payload};
    },
  },
});

export const {setPropertyData} = FormsSlice.actions;

export default FormsSlice.reducer;
