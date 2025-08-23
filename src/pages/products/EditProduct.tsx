import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { updateProduct } from '../../features/product/productSlice';
import { type ProductDto } from '../../types/product';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.product);

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [localError, setLocalError] = useState<string | null>(null);

  // Ürün yüklendiğinde formu doldur
  useEffect(() => {
    if (products.length > 0 && id) {
      const prod = products.find(p => p.id === parseInt(id));
      if (prod) {
        setProduct(prod);
        setForm({ name: prod.name, description: prod.description, price: prod.price.toString() });
      } else {
        setLocalError('Ürün bulunamadı.');
      }
    }
  }, [products, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await dispatch(updateProduct({
        id: product.id,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
      })).unwrap();

      // Başarılı ise listeye dön
      navigate('/products');
    } catch (err: any) {
      // Redux slice'taki rejected mesajını göstermek için localError kullan
      setLocalError(err || 'Güncelleme sırasında bir hata oluştu.');
    }
  };

  if (!product) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Ürün Düzenle</Typography>

      {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Ad"
          name="name"
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Açıklama"
          name="description"
          value={form.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Fiyat"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/products')}>
            İptal
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditProduct;
