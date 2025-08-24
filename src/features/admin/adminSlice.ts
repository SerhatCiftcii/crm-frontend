import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import type { AdminListDto, AddAdminDto, AdminStatusUpdateDto } from '../../types/admin';

interface AdminState {
  items: AdminListDto[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AdminState = {
  items: [],
  loading: false,
  error: null,
  success: null,
};

export const fetchAdmins = createAsyncThunk<AdminListDto[]>(
  'admins/fetch',
  async (_, thunkAPI) => {
    try {
      return await adminService.list();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message || 'Yöneticiler yüklenemedi');
    }
  }
);

export const addAdmin = createAsyncThunk<string, AddAdminDto>(
  'admins/add',
  async (dto, thunkAPI) => {
    try {
      const res = await adminService.add(dto);
      return typeof res === 'string' ? res : res.message;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message || 'Admin ekleme başarısız');
    }
  }
);

export const setAdminStatus = createAsyncThunk<string, AdminStatusUpdateDto>(
  'admins/setStatus',
  async (dto, thunkAPI) => {
    try {
      const res = await adminService.setStatus(dto);
      return typeof res === 'string' ? res : res.message;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message || 'Durum güncelleme başarısız');
    }
  }
);

export const deleteAdmin = createAsyncThunk<{ id: string; message: string }, string>(
  'admins/delete',
  async (id, thunkAPI) => {
    try {
      const res = await adminService.delete(id);
      return { id, message: res.message };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message || 'Silme başarısız');
    }
  }
);

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    clearAdminFeedback: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAdmins.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchAdmins.fulfilled, (s, a: PayloadAction<AdminListDto[]>) => {
        s.loading = false; s.items = a.payload;
      })
     .addCase(fetchAdmins.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

     .addCase(addAdmin.pending, (s) => { s.loading = true; s.error = null; s.success = null; })
     .addCase(addAdmin.fulfilled, (s, a) => { s.loading = false; s.success = String(a.payload); })
     .addCase(addAdmin.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

     .addCase(setAdminStatus.pending, (s) => { s.loading = true; s.error = null; s.success = null; })
     .addCase(setAdminStatus.fulfilled, (s, a) => { s.loading = false; s.success = String(a.payload); })
     .addCase(setAdminStatus.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

     .addCase(deleteAdmin.pending, (s) => { s.loading = true; s.error = null; s.success = null; })
     .addCase(deleteAdmin.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter(x => x.id !== a.payload.id);
        s.success = a.payload.message;
      })
     .addCase(deleteAdmin.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { clearAdminFeedback } = adminSlice.actions;
export default adminSlice.reducer;
