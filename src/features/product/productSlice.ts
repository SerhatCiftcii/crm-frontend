import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { productApi } from '../../services/productService';
import { type ProductDto, type CreateProductDto, type UpdateProductDto } from '../../types/product';

interface ProductState {
  products: ProductDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Tüm ürünleri çek
export const fetchProducts = createAsyncThunk<ProductDto[]>(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      return await productApi.getAllProducts();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ürünler yüklenemedi');
    }
  }
);

// Ürün ekleme
export const addProduct = createAsyncThunk<ProductDto, CreateProductDto>(
  'products/addProduct',
  async (data, thunkAPI) => {
    try {
      return await productApi.addProduct(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ürün eklenemedi');
    }
  }
);

// Ürün güncelleme
export const updateProduct = createAsyncThunk<ProductDto, UpdateProductDto>(
  'products/updateProduct',
  async (data, thunkAPI) => {
    try {
      return await productApi.updateProduct(data.id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ürün güncellenemedi');
    }
  }
);

// Ürün silme
export const deleteProduct = createAsyncThunk<number, number>(
  'products/deleteProduct',
  async (productId, thunkAPI) => {
    try {
      await productApi.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Ürün silinirken bir hata oluştu. Bu ürün müşterilerle ilişkili olabilir.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductDto[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // add
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<ProductDto>) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ProductDto>) => {
        state.loading = false;

        // Güvenlik kontrolü: payload veya id yoksa işlem yapma
        if (!action.payload || typeof action.payload.id === 'undefined') return;

        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
