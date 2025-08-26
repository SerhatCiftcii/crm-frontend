// src/pages/maintenances/EditMaintenance.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Grid,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateMaintenance, fetchMaintenances } from '../../features/maintenance/maintenanceSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { fetchProducts } from '../../features/product/productSlice';
import type { UpdateMaintenanceDto } from '../../types/maintenance';

// Enum değerleri ve display name
const offerStatusOptions: { [key: number]: string } = {
  0: 'Hazırlanmadı',
  1: 'Hazırlandı',
  2: 'Gönderildi',
  3: 'Onaylandı',
  4: 'Reddedildi',
};

const contractStatusOptions: { [key: number]: string } = {
  0: 'Gönderilmedi',
  1: 'Gönderildi',
  2: 'İmzalandı',
  3: 'İptal Edildi',
};

const licenseStatusOptions: { [key: number]: string } = {
  0: 'Aktif',
  1: 'Pasif',
  2: 'Bekliyor',
  3: 'Süresi Doldu',
};

const firmSituationOptions: { [key: number]: string } = {
  0: 'Devam Ediyor',
  1: 'Durduruldu',
  2: 'Tamamlandı',
  3: 'İptal Edildi',
};

// Chip renkleri
const chipColorMap: Record<string | number, "default" | "success" | "warning" | "error" | "info"> = {
  0: "default",
  1: "info",
  2: "success",
  3: "warning",
  4: "error",
  Hazırlanmadı: "default",
  Hazırlandı: "info",
  Gönderildi: "warning",
  Onaylandı: "success",
  Reddedildi: "error",
  Gönderilmedi: "default",
  İmzalandı: "success",
  "İptal Edildi": "error",
  Aktif: "success",
  Pasif: "default",
  Bekliyor: "warning",
  "Süresi Doldu": "error",
  "Devam Ediyor": "info",
  Durduruldu: "warning",
  Tamamlandı: "success",
};

const EditMaintenance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const maintenanceId = id ? parseInt(id) : null;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { maintenances, loading, error } = useAppSelector((state) => state.maintenance);
  const { customers, loading: customersLoading } = useAppSelector((state) => state.customer);
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);

  const [formData, setFormData] = useState<UpdateMaintenanceDto | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});

  useEffect(() => {
    dispatch(fetchMaintenances());
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (maintenanceId && maintenances.length > 0) {
      const maintenance = maintenances.find((m) => m.id === maintenanceId);
      if (maintenance) {
        setFormData({
          ...maintenance,
          offerStatus: parseInt(Object.keys(offerStatusOptions).find((key: any) => offerStatusOptions[key] === maintenance.offerStatus) || '0'),
          contractStatus: parseInt(Object.keys(contractStatusOptions).find((key: any) => contractStatusOptions[key] === maintenance.contractStatus) || '0'),
          licenseStatus: parseInt(Object.keys(licenseStatusOptions).find((key: any) => licenseStatusOptions[key] === maintenance.licenseStatus) || '0'),
          firmSituation: parseInt(Object.keys(firmSituationOptions).find((key: any) => firmSituationOptions[key] === maintenance.firmSituation) || '0'),
          passportCreatedDate: maintenance.passportCreatedDate?.split('T')[0] || '',
          startDate: maintenance.startDate.split('T')[0],
          endDate: maintenance.endDate.split('T')[0],
          productIds: maintenance.products.map(p => p.id),
          extendBy6Months: maintenance.extendBy6Months || false,
          extendBy1Year: maintenance.extendBy1Year || false,
        });
      }
    }
  }, [maintenanceId, maintenances]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleProductChange = (event: any) => {
    const { target: { value } } = event;
    setFormData((prev) =>
      prev ? { ...prev, productIds: typeof value === 'string' ? value.split(',').map(Number) : value } : null
    );
  };

  const handleExtendChange = (type: '6Months' | '1Year') => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            extendBy6Months: type === '6Months' ? !prev.extendBy6Months : false,
            extendBy1Year: type === '1Year' ? !prev.extendBy1Year : false,
          }
        : null
    );
  };

  const validate = () => {
    const errors: any = {};
    if (!formData) return false;
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
    if (!formData || !validate()) return;

    const payload: UpdateMaintenanceDto = {
      ...formData,
      passportCreatedDate: formData.passportCreatedDate || undefined,
    };

    await dispatch(updateMaintenance(payload));
    navigate('/maintenances');
  };

  if (loading || customersLoading || productsLoading || !formData) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Bakım Anlaşmasını Düzenle</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} columns={24}>
          <Grid size={24}>
            <FormControl fullWidth required>
              <InputLabel>Müşteri</InputLabel>
              <Select name="customerId" value={formData.customerId} onChange={handleSelectChange}>
                <MenuItem value={0}><em>Seçiniz</em></MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>{customer.companyName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={24}>
            <TextField fullWidth label="Konu" name="subject" value={formData.subject} onChange={handleChange} required />
          </Grid>

          <Grid size={24}>
            <TextField
              fullWidth
              label="Açıklama"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Başlangıç Tarihi"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              error={!!validationErrors.endDate}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Bitiş Tarihi"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              error={!!validationErrors.endDate}
              helperText={validationErrors.endDate}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Pasaport Oluşturma Tarihi"
              name="passportCreatedDate"
              type="date"
              value={formData.passportCreatedDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!validationErrors.passportCreatedDate}
              helperText={validationErrors.passportCreatedDate}
            />
          </Grid>

                    {[
              { field: 'offerStatus', label: 'Teklif Durumu', options: offerStatusOptions },
              { field: 'contractStatus', label: 'Sözleşme Durumu', options: contractStatusOptions },
              { field: 'licenseStatus', label: 'Lisans Durumu', options: licenseStatusOptions },
              { field: 'firmSituation', label: 'Firma Durumu', options: firmSituationOptions }
            ].map(({ field, label, options }) => (
              <Grid size={12} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    name={field}
                    value={formData[field as keyof typeof formData] as number}
                    onChange={handleSelectChange}
                    label={label} // üstte düzgün görünmesi için
                  >
                    {Object.entries(options).map(([val, text]) => (
                      <MenuItem key={val} value={parseInt(val)}>
                        <Chip
                          label={text}
                          size="small"
                          color={chipColorMap[text as string] || 'default'}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

          <Grid size={24}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Uzama</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  label="6 Ay"
                  clickable
                  color={formData.extendBy6Months ? 'info' : 'default'}
                  onClick={() => handleExtendChange('6Months')}
                />
                <Chip
                  label="1 Yıl"
                  clickable
                  color={formData.extendBy1Year ? 'success' : 'default'}
                  onClick={() => handleExtendChange('1Year')}
                />
              </Box>
            </Box>
          </Grid>

            <Grid size={24}>
          <FormControl fullWidth>
            <InputLabel id="products-label">Ürünler</InputLabel>
            <Select
              labelId="products-label"
              name="productIds"
              multiple
              value={formData.productIds}
              onChange={handleProductChange}
              label="Ürünler" // üstte düzgün görünmesi için
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={products.find(p => p.id === value)?.name} />
                  ))}
                </Box>
              )}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  <Checkbox checked={formData.productIds.includes(product.id)} />
                  <ListItemText primary={product.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" type="submit" disabled={loading}>Kaydet</Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/maintenances')}>İptal</Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditMaintenance;
