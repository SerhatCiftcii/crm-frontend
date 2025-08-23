// src/pages/customers/AddCustomer.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCustomer, fetchCustomers } from '../../features/customer/customerSlice';
import { useNavigate } from 'react-router-dom';
import { type CreateCustomerDto, type ProductDto } from '../../types/customer';
import { productApi } from '../../services/productService';

const statusOptions = {
  1: 'Aktif',
  2: 'Pasif',
  3: 'Beklemede',
};

const AddCustomer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.customer);

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [formData, setFormData] = useState<CreateCustomerDto>({
    companyName: '',
    branchName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    address: '',
    taxNumber: '',
    taxOffice: '',
    webSite: '',
    salesDate: null,
    status: 1,
    productIds: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await productApi.getAllProducts();
        setProducts(productList);
      } catch (err) {
        console.error('Ürünler çekilirken bir hata oluştu:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else if (name === 'productIds') {
      const selectedIds = (typeof value === 'string' ? value.split(',') : value).map(Number);
      setFormData((prev) => ({ ...prev, productIds: selectedIds }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addCustomer(formData));
    await dispatch(fetchCustomers());
    navigate('/customers'); // Listeye yönlendir
  };

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Yeni Müşteri Ekle</Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Şirket Adı" name="companyName" value={formData.companyName} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Şube Adı" name="branchName" value={formData.branchName} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Yetkili Adı" name="ownerName" value={formData.ownerName} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
        <TextField fullWidth margin="normal" label="Telefon" name="phone" value={formData.phone} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Şehir" name="city" value={formData.city} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="İlçe" name="district" value={formData.district} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Adres" name="address" value={formData.address} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Vergi Numarası" name="taxNumber" value={formData.taxNumber} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Vergi Dairesi" name="taxOffice" value={formData.taxOffice} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Web Sitesi" name="webSite" value={formData.webSite} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Satış Tarihi" name="salesDate" type="date" value={formData.salesDate || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />

        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Durum</InputLabel>
          <Select labelId="status-label" name="status" value={formData.status.toString()} onChange={handleSelectChange}>
            {Object.entries(statusOptions).map(([val, label]) => (
              <MenuItem key={val} value={val}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="product-label">Ürünler</InputLabel>
          <Select
            labelId="product-label"
            multiple
            name="productIds"
            value={formData.productIds}
            onChange={handleSelectChange}
            input={<OutlinedInput label="Ürünler" />}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" disabled={loading}>Kaydet</Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/customers')}>İptal</Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddCustomer;
