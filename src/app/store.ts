// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/customer/customerSlice';
import productReducer from '../features/product/productSlice';
import adminReducer from '../features/admin/adminSlice';
import authorizedPersonReducer from '../features/authorizedPerson/authorizedPersonSlice';
import maintenanceReducer from '../features/maintenance/maintenanceSlice'; // Yeni eklenen reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    product: productReducer,
    admins: adminReducer,
    authorizedPerson: authorizedPersonReducer,
    maintenance: maintenanceReducer, // Yeni eklenen maintenance reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
