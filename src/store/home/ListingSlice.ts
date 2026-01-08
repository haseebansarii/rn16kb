import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: any = {
  home_listing: null,
  countryList: null,
  selectedCountry: 'New Zealand',
  searchFilter: '',
  searchCatagories: '',
  searchSubCategory: '',
  locationData: {
    lat: '',
    lng: '',
    radius: '',
    address: '',
  },
  locationSearchData: [],
  location: '',
  apiCallNearMe: false,
};

export const stackSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    homeListing: (state: any, action: PayloadAction<any>) => {
      state.home_listing = action.payload;
    },
    setCountryList: (state: any, action: PayloadAction<any>) => {
      state.countryList = action.payload;
    },
    setSelectedCountry: (state: any, action: PayloadAction<any>) => {
      state.selectedCountry = action.payload;
    },
    setSearchFilter: (state: any, action: PayloadAction<any>) => {
      state.searchFilter = action.payload;
    },
    setSearchCatagories: (state: any, action: PayloadAction<any>) => {
      state.searchCatagories = action.payload;
    },
    setSearchSubCatagory: (state: any, action: PayloadAction<any>) => {
      state.searchSubCategory = action.payload;
    },
    setLocationData: (state: any, action: PayloadAction<any>) => {
      state.locationData = action.payload;
    },
    setApiCallNearMe: (state: any, action: PayloadAction<any>) => {
      state.apiCallNearMe = action.payload;
    },
    setLocationSearchData: (state: any, action: PayloadAction<any>) => {
      state.locationSearchData = action.payload;
    },
    setLocation: (state: any, action: PayloadAction<any>) => {
      console.log('location redux=========', state.location);
      state.location = action.payload;
    },
  },
});

export const {
  homeListing,
  setSelectedCountry,
  setSearchFilter,
  setCountryList,
  setLocation,
  setSearchCatagories,
  setSearchSubCatagory,
  setLocationData,
  setLocationSearchData,
  setApiCallNearMe,
} = stackSlice.actions;

export default stackSlice.reducer;
