// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/customer/customerSlice'; // Yeni satır
import productReducer from '../features/product/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer, // Yeni satır
    product: productReducer,
  },
});

// RootState ve AppDispatch tipleri
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
