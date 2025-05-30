import {Provider} from 'react-redux';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import countReducer from './slices/countSlice';
import productSlice from './slices/productSlice';
import countryCodeSlice from './slices/countryCodeSlice';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import chatSlice from './slices/chatSlice';
import friendshipReducer from './slices/friendSlice';
import friendSlice from './slices/friendSlice';
import callSlice from './slices/callSlice';

const rootReducer = combineReducers({
  count: countReducer,
  product: productSlice,
  countryCode: countryCodeSlice,
  authentication: authSlice,
  user: userSlice,
  chat: chatSlice,
  friendship: friendshipReducer,
  friend: friendSlice,
  call: callSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {warnAfter: 128},
      serializableCheck: {warnAfter: 128},
    }),
});

export function AppProvider({children}) {
  return <Provider store={store}>{children}</Provider>;
}
