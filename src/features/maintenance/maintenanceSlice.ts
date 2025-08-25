

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { maintenanceService } from '../../services/maintenanceService';
import type { MaintenanceDto, CreateMaintenanceDto, UpdateMaintenanceDto } from '../../types/maintenance';

interface MaintenanceState {
  maintenances: MaintenanceDto[];
  loading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  maintenances: [],
  loading: false,
  error: null,
};

// Enum değerlerini ve display name'lerini eşleyen objeler
const offerStatusMap: { [key: number]: string } = {
  0: 'Hazırlanmadı',
  1: 'Hazırlandı',
  2: 'Gönderildi',
  3: 'Onaylandı',
  4: 'Reddedildi',
};

const contractStatusMap: { [key: number]: string } = {
  0: 'Gönderilmedi',
  1: 'Gönderildi',
  2: 'İmzalandı',
  3: 'İptal Edildi',
};

const licenseStatusMap: { [key: number]: string } = {
  0: 'Aktif',
  1: 'Pasif',
  2: 'Bekliyor',
  3: 'Süresi Doldu',
};

const firmSituationMap: { [key: number]: string } = {
  0: 'Devam Ediyor',
  1: 'Durduruldu',
  2: 'Tamamlandı',
  3: 'İptal Edildi',
};

// Asenkron Thunk'lar
export const fetchMaintenances = createAsyncThunk('maintenance/fetchMaintenances', async (_, { rejectWithValue }) => {
  try {
    return await maintenanceService.getAllMaintenances();
  } catch (err: any) {
    return rejectWithValue(err.message || 'Bakım anlaşmaları yüklenirken bir hata oluştu.');
  }
});

export const addMaintenance = createAsyncThunk('maintenance/addMaintenance', async (maintenance: CreateMaintenanceDto, { rejectWithValue }) => {
  try {
    return await maintenanceService.addMaintenance(maintenance);
  } catch (err: any) {
    return rejectWithValue(err.message || 'Bakım anlaşması eklenirken bir hata oluştu.');
  }
});

export const updateMaintenance = createAsyncThunk('maintenance/updateMaintenance', async (maintenance: UpdateMaintenanceDto, { rejectWithValue }) => {
  try {
    await maintenanceService.updateMaintenance(maintenance.id, maintenance);
    return maintenance;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Bakım anlaşması güncellenirken bir hata oluştu.');
  }
});

export const deleteMaintenance = createAsyncThunk('maintenance/deleteMaintenance', async (id: number, { rejectWithValue }) => {
  try {
    await maintenanceService.deleteMaintenance(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Bakım anlaşması silinirken bir hata oluştu.');
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Maintenances
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = action.payload;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Maintenance
      .addCase(addMaintenance.fulfilled, (state, action) => {
        state.maintenances.push(action.payload);
      })
      // Update Maintenance - Hata burada düzeltildi
      .addCase(updateMaintenance.fulfilled, (state, action: PayloadAction<UpdateMaintenanceDto>) => {
        const index = state.maintenances.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          const updatedMaintenance = {
            ...state.maintenances[index],
            ...action.payload,
            offerStatus: offerStatusMap[action.payload.offerStatus] || 'Bilinmiyor',
            contractStatus: contractStatusMap[action.payload.contractStatus] || 'Bilinmiyor',
            licenseStatus: licenseStatusMap[action.payload.licenseStatus] || 'Bilinmiyor',
            firmSituation: firmSituationMap[action.payload.firmSituation] || 'Bilinmiyor',
          };
          state.maintenances[index] = updatedMaintenance;
        }
      })
      // Delete Maintenance
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.maintenances = state.maintenances.filter(m => m.id !== action.payload);
      });
  },
});

export default maintenanceSlice.reducer;
