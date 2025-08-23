import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { type ProductDto } from '../../types/product';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useAppSelector(state => state.product);

  const [product, setProduct] = useState<ProductDto | null>(null);

  useEffect(() => {
    if (products.length > 0 && id) {
      const prod = products.find(p => p.id === parseInt(id));
      if (prod) setProduct(prod);
    }
  }, [products, id]);

  if (!product) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Ürün Detayları</Typography>
      <Typography><strong>ID:</strong> {product.id}</Typography>
      <Typography><strong>Ad:</strong> {product.name}</Typography>
      <Typography><strong>Açıklama:</strong> {product.description}</Typography>
      <Typography><strong>Fiyat:</strong> {product.price.toFixed(2)}</Typography>
      <Typography><strong>Oluşturulma:</strong> {product.createdAt.split('T')[0]}</Typography>
      <Typography><strong>Güncellenme:</strong> {product.updatedAt.split('T')[0]}</Typography>
      <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/products')}>Geri Dön</Button>
    </Box>
  );
};

export default ProductDetails;
