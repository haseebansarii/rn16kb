import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  step: {
    selectedTab: 1,
    isEmailVerified: false,
    isNumberVerified: false,
    isSecondStepVerified: false,
    verifiedStep: 1,
    firstStep: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      phone_number: '',
      plan_id: '',
    },
    isFirstStepErr: true,
    isSecondStepErr: false,
  },
  userVerified: false,
  subscription: {},
  stripeCard: [],
  signUpBasic: {},
  subscription_plans: [],
  plan_id: null,
  congratulation: false,
  subscriptionFlags: {
    cardViewFlag: false,
    addCardFlag: false,
    stripeViewFlag: false,
    subscriptionPlanFlag: true,
  },
  locationDropDownSelected: '',
};

export const slice = createSlice({
  name: 'SignUp',
  initialState,
  reducers: {
    setStep: (state, {payload}) => {
      state.step = {...state.step, ...payload};
    },
    setStepInitial: (state, {payload}) => {
      state.step = {...initialState.step};
    },
    setUserVerified: (state, action) => {
      state.userVerified = action.payload;
    },
    setSubscriptionPlan: (state, action) => {
      state.subscription = action.payload;
    },
    planId: (state, action) => {
      state.plan_id = action.payload;
    },
    setStripeCard: (state, action) => {
      state.stripeCard = action.payload;
    },
    setSignUpUser: (state, {payload}) => {
      state.signUpBasic = {...state.signUpBasic, ...payload};
    },
    storeSubscriptionPlans: (state, action) => {
      state.subscription_plans = action.payload;
    },
    setClearSignUpBasic: (state, {payload}) => {
      state.signUpBasic = payload;
    },
    setCongratulation: (state, {payload}) => {
      state.congratulation = payload;
    },
    setLocationDropDownSelected: (state, {payload}) => {
      state.locationDropDownSelected = payload;
    },

    clearSignUpData: () => ({...initialState}),
    setSubscriptionFlags: (state, {payload}) => {
      state.subscriptionFlags = {...state.subscriptionFlags, ...payload};
    },
  },
});

export const {
  setStep,
  setStepInitial,
  setSubscriptionPlan,
  setSignUpUser,
  storeSubscriptionPlans,
  setStripeCard,
  setClearSignUpBasic,
  setUserVerified,
  planId,
  clearSignUpData,
  setCongratulation,
  setSubscriptionFlags,
  setLocationDropDownSelected,
} = slice.actions;

export default slice.reducer;
