// src/features/customer/customerSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '../../services/customerService';
import {
  type CustomerDto,
  type CreateCustomerDto,
  type UpdateCustomerDto,
} from '../../types/customer';

// Müşteri state'inin tip tanımı
interface CustomerState {
  customers: CustomerDto[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

// Asenkron thunk'lar
export const fetchCustomers = createAsyncThunk<CustomerDto[]>(
  'customers/fetchCustomers',
  async (_, thunkAPI) => {
    try {
      return await customerService.getAllCustomers();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  },
);

export const addCustomer = createAsyncThunk<CustomerDto, CreateCustomerDto>(
  'customers/addCustomer',
  async (customerData, thunkAPI) => {
    try {
      const addedCustomer = await customerService.addCustomer(customerData);
      return addedCustomer;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add customer');
    }
  },
);

export const updateCustomer = createAsyncThunk<void, UpdateCustomerDto>(
  'customers/updateCustomer',
  async (customerData, thunkAPI) => {
    try {
      await customerService.updateCustomer(customerData.id, customerData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  },
);

export const deleteCustomer = createAsyncThunk<number, number>(
  'customers/deleteCustomer',
  async (customerId, thunkAPI) => {
    try {
      await customerService.deleteCustomer(customerId);
      return customerId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete customer');
    }
  },
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Müşterileri çekme
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomerDto[]>) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Müşteri ekleme
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action: PayloadAction<CustomerDto>) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Müşteri güncelleme
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        // Güncelleme işleminden sonra veriyi tekrar çekmek en güvenli yöntem
        // veya state'i manuel güncellemek
        // Ben burada daha güvenli bir yöntem olan veriyi yeniden çekmeyi öneriyorum.
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Müşteri silme
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.customers = state.customers.filter((customer) => customer.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerSlice.reducer;
