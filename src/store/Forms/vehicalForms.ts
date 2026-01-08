import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  vehicalData: {
    title: '',
    category: '',
    sub_category: '',
    make: '',
    model: '',
    type: 'enquire',
    images: [],
    condition: '',
    start_price: null,
    reserve_price: null,
    buy_now_price: null,
    description: '',
    pickup_available: false,
    pickup_location: '',
    pickup_location_coordinates: {
      lat: null,
      lng: null,
    },
    payment_option: 'other',
    start_date: null,
    end_date: null,
    end_time: null,
    show_phone: false,
    listing_type: 'vehicle',
    year: null,
    model_detail: '',
    import_history: null,
    body: '',
    no_of_seats: null,
    no_of_doors: null,
    previous_owners: null,
    kilometers: '',
    color: '',
    vin: '',
    engine_size: '',
    transmission: 'auto',
    fuel_type: null,
    cylinders: null,
    // drive_type: 'right-hand',
    registration_expiry: null,
    reported_stolen: false,
    imported_damaged: false,
    wof_expiry: null,
    fixed_price_offer: null,
    on_road_cost_included: false,
    make_an_offer: false,
    shipping: null,
    enable_good_lending_finance: false,
  },
};

export const FormsSlice = createSlice({
  name: 'vehical',
  initialState,
  reducers: {
    setVehicalData: (state, {payload}) => {
      state.vehicalData = {...state.vehicalData, ...payload};
    },
    setVehicalDataEpmty: (state, {payload}) => {
      state.vehicalData = initialState.vehicalData;
    },
  },
});

export const {setVehicalData, setVehicalDataEpmty} = FormsSlice.actions;

export default FormsSlice.reducer;
