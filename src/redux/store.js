import {Provider} from 'react-redux';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import countReducer from './slices/countSlice';
import productSlice from './slices/productSlice';

const rootReducer = combineReducers({
  count: countReducer,
  product: productSlice,
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
