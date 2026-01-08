import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {MMKV} from 'react-native-mmkv';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  Storage,
  persistReducer,
  persistStore,
} from 'redux-persist';
import {api} from '../services/api';
import {
  AuthSlice,
  Branding,
  Agents,
  Catagories,
  Forms,
  ProductDetailSlice,
  SignUp,
  StackSlice,
  accountSettings,
  list,
  notifications,
  productOffer,
  profileTab,
  reviewListData,
  userFeedBackData,
  chats,
  homeListing,
  propertyForm,
  vehicalForms,
  itemForSaleProduct,
} from '../store';
import common from './common';
import theme from './theme';

const reducers = combineReducers({
  theme,
  auth: AuthSlice,
  branding: Branding,
  agents: Agents,
  productOffer: productOffer,
  stack: StackSlice,
  signup: SignUp,
  chats: chats,
  vehicalForms: vehicalForms,
  propertyForm: propertyForm,
  homeListing: homeListing,
  common: common,
  catagories: Catagories,
  forms: Forms,
  itemForSaleProduct,
  product: ProductDetailSlice,
  list: list,
  userFeedBackData: userFeedBackData,
  reviewListData: reviewListData,
  accountSettings: accountSettings,
  profileTab: profileTab,
  notifications: notifications,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (state: ReturnType<typeof reducers>, action: any) => {
  /* if you are using RTK, you can import your action and use it's type property instead of the literal definition of the action  */
  if (action.type === 'logout') {
    console.log('Clearing the store ....');
    // return reducers(undefined, {type: undefined});
    storage.clearAll();
    state = undefined as any;
  }

  return reducers(state, action);
};
const encryptionKey = 'com.isqroll-256-bit-hex-key-outsource';
const storage = new MMKV({
  id: 'com.isqroll', // Optional storage ID
  encryptionKey: encryptionKey, // Your custom encryption key
});
export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['theme', 'auth', 'faqs'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as any);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares: any = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // serializableCheck: true,
    }).concat(api.middleware);

    // if (__DEV__ && !process.env.JEST_WORKER_ID) {
    //   const createDebugger = require('redux-flipper').default;
    //   middlewares.push(createDebugger());
    // }

    return middlewares;
  },
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<any>;

export {persistor, store};
