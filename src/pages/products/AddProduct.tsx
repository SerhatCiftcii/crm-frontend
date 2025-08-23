import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addProduct, fetchProducts } from '../../features/product/productSlice';
import { useNavigate } from 'react-router-dom';
import { type CreateProductDto } from '../../types/product';

const AddProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.product);

  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addProduct(formData));
    await dispatch(fetchProducts());
    navigate('/products');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Yeni Ürün Ekle</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Ürün Adı" name="name" value={formData.name} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Açıklama" name="description" value={formData.description} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Fiyat" name="price" type="number" value={formData.price} onChange={handleChange} required />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" disabled={loading}>Kaydet</Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/products')}>İptal</Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProduct;
