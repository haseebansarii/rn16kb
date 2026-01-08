import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  shippingMethods: false,
  deleteItemForSale: false,
  withDrawItemForSale: false,
  updateItemForSale: false,
  sellingItemForSale: false,
  itemForSale: {
    type: 'fixed_price',
    title: '',
    make: '',
    pickup_available: false,
    pickup_location: '',
    pickup_location_coordinates: {
      lat: null,
      lng: null,
    },
    model: '',
    start_price: null,
    buy_now_price: '',
    fixed_price_offer: '',
    desc: '',
    catagory: '',

    make_an_offer: false,
    show_phone: false,
    subCatagory: '',
    reserve_price: null,
    end_time: null,
    listing_type: 'general',
    condition: '',
    end_date: null,
    payment_option: 'other',

    shipping: '',
    start_date: null,
    images: [],
  },
};

export const FormsSlice = createSlice({
  name: 'itemForSale',
  initialState,
  reducers: {
    setItemForSale: (state, {payload}) => {
      state.itemForSale = {...state.itemForSale, ...payload};
    },
    setShippingMethods: (state, {payload}) => {
      state.shippingMethods = payload;
    },
    setDeleteItemForSale: (state, {payload}) => {
      state.deleteItemForSale = payload;
    },
    setWithDrawItemForSale: (state, {payload}) => {
      state.withDrawItemForSale = payload;
    },
    setUpdateItemForSale: (state, {payload}) => {
      state.updateItemForSale = payload;
    },
    setSellingItemForSale: (state, {payload}) => {
      state.sellingItemForSale = payload;
    },
    clearAllListingData: () => ({...initialState}),
  },
});

export const {
  setDeleteItemForSale,
  setWithDrawItemForSale,
  setUpdateItemForSale,
  setShippingMethods,
  setItemForSale,
  setSellingItemForSale,
  clearAllListingData,
} = FormsSlice.actions;

export default FormsSlice.reducer;
