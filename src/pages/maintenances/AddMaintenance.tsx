// src/pages/maintenances/AddMaintenance.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Checkbox,
  Chip,
  ListItemText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addMaintenance } from '../../features/maintenance/maintenanceSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { fetchProducts } from '../../features/product/productSlice';
import type { CreateMaintenanceDto } from '../../types/maintenance';

// Enum değerlerini ve display name'lerini eşleyen objeler
const offerStatusOptions = { 0: 'Hazırlanmadı', 1: 'Hazırlandı', 2: 'Gönderildi', 3: 'Onaylandı', 4: 'Reddedildi' };
const contractStatusOptions = { 0: 'Gönderilmedi', 1: 'Gönderildi', 2: 'İmzalandı', 3: 'İptal Edildi' };
const licenseStatusOptions = { 0: 'Aktif', 1: 'Pasif', 2: 'Bekliyor', 3: 'Süresi Doldu' };
const firmSituationOptions = { 0: 'Devam Ediyor', 1: 'Durduruldu', 2: 'Tamamlandı', 3: 'İptal Edildi' };

const AddMaintenance: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.maintenance);
  const { customers, loading: customersLoading } = useAppSelector((state) => state.customer);
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);

  const [formData, setFormData] = useState<CreateMaintenanceDto>({
    customerId: 0,
    subject: '',
    startDate: '',
    endDate: '',
    passportCreatedDate: '',
    offerStatus: 0,
    contractStatus: 0,
    licenseStatus: 0,
    firmSituation: 0,
    description: '',
    productIds: [],
    extendBy6Months: false,
    extendBy1Year: false,
  });

  const [validationErrors, setValidationErrors] = useState<any>({});

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (event: any) => {
    const { target: { value } } = event;
    setFormData((prev) => ({
      ...prev,
      productIds: typeof value === 'string' ? value.split(',').map(Number) : value,
    }));
  };

  const validate = () => {
    const errors: any = {};
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) errors.endDate = "Bitiş Tarihi, başlangıç tarihinden sonra olmalıdır.";
    }
    if (formData.passportCreatedDate) {
      const passportDate = new Date(formData.passportCreatedDate);
      if (passportDate > new Date()) errors.passportCreatedDate = "Pasaport oluşturma tarihi gelecekte olamaz.";
    }
    if (formData.description && formData.description.length > 300) errors.description = "Açıklama en fazla 300 karakter olabilir.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateMaintenanceDto = {
      ...formData,
      passportCreatedDate: formData.passportCreatedDate || undefined,
    };

    await dispatch(addMaintenance(payload));
    navigate('/maintenances');
  };

  if (customersLoading || productsLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Yeni Bakım Anlaşması Ekle</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Müşteri</InputLabel>
          <Select name="customerId" value={formData.customerId} onChange={handleSelectChange}>
            <MenuItem value={0}><em>Seçiniz</em></MenuItem>
            {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.companyName}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField fullWidth margin="normal" label="Konu" name="subject" value={formData.subject} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Açıklama" name="description" value={formData.description} onChange={handleChange} multiline rows={4} error={!!validationErrors.description} helperText={validationErrors.description} />
        <TextField fullWidth margin="normal" label="Başlangıç Tarihi" name="startDate" type="date" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required error={!!validationErrors.endDate} />
        <TextField fullWidth margin="normal" label="Bitiş Tarihi" name="endDate" type="date" value={formData.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required error={!!validationErrors.endDate} helperText={validationErrors.endDate} />
        <TextField fullWidth margin="normal" label="Pasaport Oluşturma Tarihi" name="passportCreatedDate" type="date" value={formData.passportCreatedDate} onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!validationErrors.passportCreatedDate} helperText={validationErrors.passportCreatedDate} />

        <FormControl fullWidth margin="normal">
          <InputLabel>Teklif Durumu</InputLabel>
          <Select name="offerStatus" value={formData.offerStatus} onChange={handleSelectChange}>
            {Object.entries(offerStatusOptions).map(([val, label]) => <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Sözleşme Durumu</InputLabel>
          <Select name="contractStatus" value={formData.contractStatus} onChange={handleSelectChange}>
            {Object.entries(contractStatusOptions).map(([val, label]) => <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Lisans Durumu</InputLabel>
          <Select name="licenseStatus" value={formData.licenseStatus} onChange={handleSelectChange}>
            {Object.entries(licenseStatusOptions).map(([val, label]) => <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Firma Durumu</InputLabel>
          <Select name="firmSituation" value={formData.firmSituation} onChange={handleSelectChange}>
            {Object.entries(firmSituationOptions).map(([val, label]) => <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="products-label">Ürünler</InputLabel>
          <Select
            labelId="products-label"
            name="productIds"
            multiple
            value={formData.productIds}
            onChange={handleProductChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => <Chip key={value} label={products.find(p => p.id === value)?.name} />)}
              </Box>
            )}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                <Checkbox checked={formData.productIds.indexOf(product.id) > -1} />
                <ListItemText primary={product.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ✅ 6 Ay / 1 Yıl Uzatma */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Bakım Uzatma</InputLabel>
          <Select
            name="extendBy"
            value={formData.extendBy6Months ? '6' : formData.extendBy1Year ? '12' : ''}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                extendBy6Months: value === '6',
                extendBy1Year: value === '12',
              }));
            }}
          >
            <MenuItem value=""><em>Seçiniz</em></MenuItem>
            <MenuItem value="6">6 Ay</MenuItem>
            <MenuItem value="12">1 Yıl</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">Kaydet</Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/maintenances')}>İptal</Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddMaintenance;
