// src/pages/maintenances/MaintenanceDetail.tsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMaintenances } from '../../features/maintenance/maintenanceSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { fetchProducts } from '../../features/product/productSlice';

// Chip renkleri için map
const chipColorMap: Record<string | number, "default" | "success" | "warning" | "error" | "info"> = {
  0: "default",
  1: "info",
  2: "success",
  3: "warning",
  4: "error",
  "Hazırlanmadı": "default",
  "Hazırlandı": "info",
  "Gönderildi": "warning",
  "Onaylandı": "success",
  "Reddedildi": "error",
  "Gönderilmedi": "default",
  "İmzalandı": "success",
  "İptal Edildi": "error",
  "Aktif": "success",
  "Pasif": "default",
  "Bekliyor": "warning",
  "Süresi Doldu": "error",
  "Devam Ediyor": "info",
  "Durduruldu": "warning",
  "Tamamlandı": "success",
};

// Detay satırı componenti
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="bold">
      {value || '-'}
    </Typography>
  </Stack>
);

const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { maintenances, loading, error } = useAppSelector((state) => state.maintenance);
  const { customers, loading: customersLoading } = useAppSelector((state) => state.customer);
  const {  loading: productsLoading } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchMaintenances());
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const maintenance = maintenances.find((m) => m.id === Number(id));

  if (loading || customersLoading || productsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/maintenances')}
        >
          Listeye Geri Dön
        </Button>
      </Box>
    );
  }

  if (!maintenance) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">Bakım anlaşması bulunamadı.</Alert>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/maintenances')}
        >
          Listeye Geri Dön
        </Button>
      </Box>
    );
  }

  const getCustomerNameById = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || "Bilinmiyor";
  };

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={6} sx={{ p: 5, width: '100%', maxWidth: 900, position: 'relative' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => navigate('/maintenances')}
        >
          Listeye Geri Dön
        </Button>

        <Typography variant="h4" align="center" gutterBottom>
          Bakım Anlaşması Detayları
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Temel Bilgiler
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <DetailItem label="Müşteri" value={getCustomerNameById(maintenance.customerId)} />
            <DetailItem label="Konu" value={maintenance.subject} />
            <DetailItem label="Başlangıç Tarihi" value={maintenance.startDate?.split('T')[0]} />
            <DetailItem label="Bitiş Tarihi" value={maintenance.endDate?.split('T')[0]} />
            <DetailItem label="Pasaport Tarihi" value={maintenance.passportCreatedDate?.split('T')[0]} />
            <DetailItem
              label="Uzama"
              value={
                <Chip
                  label={maintenance.extendBy6Months ? '6 Ay' : maintenance.extendBy1Year ? '1 Yıl' : '-'}
                  size="small"
                  color={maintenance.extendBy6Months ? 'info' : maintenance.extendBy1Year ? 'success' : 'default'}
                />
              }
            />
            <DetailItem
              label="Teklif Durumu"
              value={<Chip label={maintenance.offerStatus} size="small" color={chipColorMap[maintenance.offerStatus] || 'default'} />}
            />
            <DetailItem
              label="Sözleşme Durumu"
              value={<Chip label={maintenance.contractStatus} size="small" color={chipColorMap[maintenance.contractStatus] || 'default'} />}
            />
            <DetailItem
              label="Lisans Durumu"
              value={<Chip label={maintenance.licenseStatus} size="small" color={chipColorMap[maintenance.licenseStatus] || 'default'} />}
            />
            <DetailItem
              label="Firma Durumu"
              value={<Chip label={maintenance.firmSituation} size="small" color={chipColorMap[maintenance.firmSituation] || 'default'} />}
            />
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Açıklama
          </Typography>
          <Typography variant="body1">{maintenance.description || '-'}</Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Ekli Ürünler
          </Typography>
          {maintenance.products && maintenance.products.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {maintenance.products.map((product) => (
                <Chip key={product.id} label={product.name} />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Bu anlaşmaya ekli ürün bulunmamaktadır.
            </Typography>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default MaintenanceDetail;
