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
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateMaintenance, fetchMaintenances } from '../../features/maintenance/maintenanceSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { fetchProducts } from '../../features/product/productSlice';
import type { UpdateMaintenanceDto } from '../../types/maintenance';
import { Checkbox, Chip, ListItemText } from '@mui/material';

// Enum değerlerini ve display name'lerini eşleyen objeler
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
          // Durum kodlarını sayısal değere dönüştürerek formData'ya atama
          offerStatus: parseInt(Object.keys(offerStatusOptions).find((key: any) => offerStatusOptions[key] === maintenance.offerStatus) || '0'),
          contractStatus: parseInt(Object.keys(contractStatusOptions).find((key: any) => contractStatusOptions[key] === maintenance.contractStatus) || '0'),
          licenseStatus: parseInt(Object.keys(licenseStatusOptions).find((key: any) => licenseStatusOptions[key] === maintenance.licenseStatus) || '0'),
          firmSituation: parseInt(Object.keys(firmSituationOptions).find((key: any) => firmSituationOptions[key] === maintenance.firmSituation) || '0'),
          // PASAPORT TARİHİ İÇİN DÜZELTME YAPILDI: Tarih formatı uyarıları için split kullanıldı.
          passportCreatedDate: maintenance.passportCreatedDate?.split('T')[0] || '',
          startDate: maintenance.startDate.split('T')[0],
          endDate: maintenance.endDate.split('T')[0],
          productIds: maintenance.products.map(p => p.id) // Eksik olan productIds alanını ekledik
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
    const {
      target: { value },
    } = event;
    setFormData((prev) =>
      prev ? { ...prev, productIds: typeof value === 'string' ? value.split(',').map(Number) : value } : null
    );
  };

  const validate = () => {
    const errors: any = {};
    if (!formData) return false;
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        errors.endDate = "Bitiş Tarihi, başlangıç tarihinden sonra olmalıdır.";
      }
    }
    if (formData.passportCreatedDate) {
      const passportDate = new Date(formData.passportCreatedDate);
      if (passportDate > new Date()) {
        errors.passportCreatedDate = "Pasaport oluşturma tarihi gelecekte olamaz.";
      }
    }
    if (formData.description && formData.description.length > 300) {
      errors.description = "Açıklama en fazla 300 karakter olabilir.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validate()) return;
    
    // Hata düzeltmesi: passportCreatedDate değeri boşsa undefined olarak gönderilir.
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Müşteri</InputLabel>
          <Select name="customerId" value={formData.customerId} onChange={handleSelectChange}>
            <MenuItem value={0}><em>Seçiniz</em></MenuItem>
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField fullWidth margin="normal" label="Konu" name="subject" value={formData.subject} onChange={handleChange} required />
        <TextField
          fullWidth
          margin="normal"
          label="Açıklama"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          error={!!validationErrors.description}
          helperText={validationErrors.description}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Başlangıç Tarihi"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!validationErrors.endDate}
        />
        <TextField
          fullWidth
          margin="normal"
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
        <TextField
          fullWidth
          margin="normal"
          label="Pasaport Oluşturma Tarihi"
          name="passportCreatedDate"
          type="date"
          value={formData.passportCreatedDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!validationErrors.passportCreatedDate}
          helperText={validationErrors.passportCreatedDate}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Teklif Durumu</InputLabel>
          <Select name="offerStatus" value={formData.offerStatus} onChange={handleSelectChange}>
            {Object.entries(offerStatusOptions).map(([val, label]) => (
              <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Sözleşme Durumu</InputLabel>
          <Select name="contractStatus" value={formData.contractStatus} onChange={handleSelectChange}>
            {Object.entries(contractStatusOptions).map(([val, label]) => (
              <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Lisans Durumu</InputLabel>
          <Select name="licenseStatus" value={formData.licenseStatus} onChange={handleSelectChange}>
            {Object.entries(licenseStatusOptions).map(([val, label]) => (
              <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Firma Durumu</InputLabel>
          <Select name="firmSituation" value={formData.firmSituation} onChange={handleSelectChange}>
            {Object.entries(firmSituationOptions).map(([val, label]) => (
              <MenuItem key={val} value={parseInt(val)}>{label}</MenuItem>
            ))}
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

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" disabled={loading}>Kaydet</Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/maintenances')}>İptal</Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditMaintenance;
