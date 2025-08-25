import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authorizedPersonApi } from '../../services/authorizedPersonService';
import {
   type AuthorizedPersonDto,
type  CreateAuthorizedPersonDto,
 type UpdateAuthorizedPersonDto,
} from '../../types/authorizedPerson';

interface AuthorizedPersonState {
  list: AuthorizedPersonDto[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorizedPersonState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchAuthorizedPersons = createAsyncThunk(
  'authorizedPersons/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await authorizedPersonApi.getAll();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Yetkililer yüklenemedi');
    }
  }
);

export const addAuthorizedPerson = createAsyncThunk(
  'authorizedPersons/add',
  async (data: CreateAuthorizedPersonDto, thunkAPI) => {
    try {
      return await authorizedPersonApi.add(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Ekleme başarısız');
    }
  }
);

export const updateAuthorizedPerson = createAsyncThunk(
  'authorizedPersons/update',
  async (data: UpdateAuthorizedPersonDto, thunkAPI) => {
    try {
      return await authorizedPersonApi.update(data.id, data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Güncelleme başarısız');
    }
  }
);

export const deleteAuthorizedPerson = createAsyncThunk(
  'authorizedPersons/delete',
  async (id: number, thunkAPI) => {
    try {
      await authorizedPersonApi.delete(id);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Silme başarısız');
    }
  }
);

const authorizedPersonSlice = createSlice({
  name: 'authorizedPerson',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthorizedPersons.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAuthorizedPersons.fulfilled, (state, action: PayloadAction<AuthorizedPersonDto[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAuthorizedPersons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addAuthorizedPerson.fulfilled, (state, action: PayloadAction<AuthorizedPersonDto>) => {
        state.list.push(action.payload);
      })

      .addCase(updateAuthorizedPerson.fulfilled, (state, action: PayloadAction<AuthorizedPersonDto>) => {
        const idx = state.list.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      .addCase(deleteAuthorizedPerson.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      });
  },
});

export default authorizedPersonSlice.reducer;
