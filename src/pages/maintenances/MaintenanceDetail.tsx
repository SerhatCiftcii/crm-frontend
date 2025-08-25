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

// Enum değerlerini ve display name'lerini eşleyenler.
const offerStatusOptions = {
  0: 'Hazırlanmadı',
  1: 'Hazırlandı',
  2: 'Gönderildi',
  3: 'Onaylandı',
  4: 'Reddedildi',
};

const contractStatusOptions = {
  0: 'Gönderilmedi',
  1: 'Gönderildi',
  2: 'İmzalandı',
  3: 'İptal Edildi',
};

const licenseStatusOptions = {
  0: 'Aktif',
  1: 'Pasif',
  2: 'Bekliyor',
  3: 'Süresi Doldu',
};

const firmSituationOptions = {
  0: 'Devam Ediyor',
  1: 'Durduruldu',
  2: 'Tamamlandı',
  3: 'İptal Edildi',
};

 
const getStatChip = (statusType: 'offer' | 'contract' | 'license' | 'firm', statusValue: number) => {
  let label = '';
  switch (statusType) {
    case 'offer':
      label = offerStatusOptions[statusValue as keyof typeof offerStatusOptions] || 'Bilinmiyor';
      break;
    case 'contract':
      label = contractStatusOptions[statusValue as keyof typeof contractStatusOptions] || 'Bilinmiyor';
      break;
    case 'license':
      label = licenseStatusOptions[statusValue as keyof typeof licenseStatusOptions] || 'Bilinmiyor';
      break;
    case 'firm':
      label = firmSituationOptions[statusValue as keyof typeof firmSituationOptions] || 'Bilinmiyor';
      break;
  }
  return <Chip label={label} size="small" />;
};

const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Müşteri, ürün ve bakım anlaşması verilerini Redux store'dan alıyoruz
  const { maintenances, loading, error } = useAppSelector((state) => state.maintenance);
  const { customers, loading: customersLoading } = useAppSelector((state) => state.customer);
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);

  // Sayfa yüklendiğinde tüm gerekli verileri çekiyoruz
  useEffect(() => {
    dispatch(fetchMaintenances());
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const maintenance = maintenances.find((m) => m.id === Number(id));

  // Yüklenme durumları
  if (loading || customersLoading || productsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Hata durumu
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

  // Bakım anlaşması bulunamadıysa
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

  // Müşteri ID'sine göre şirket adını bulur
  const getCustomerNameById = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || "Bilinmiyor";
  };
  
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

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Bakım Anlaşması Detayları</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/maintenances')}
        >
          Listeye Geri Dön
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Temel Bilgiler
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5}>
          {/* Müşteri ID'sini müşteri adıyla eşleştiriyoruz */}
          <DetailItem label="Müşteri" value={getCustomerNameById(maintenance.customerId)} />
          {/* Konu alanını, Müşteri adını gösterecek şekilde güncelledim */}
          <DetailItem label="Konu" value={maintenance.subject || getCustomerNameById(maintenance.customerId)} />
          <DetailItem label="Başlangıç Tarihi" value={maintenance.startDate?.split('T')[0]} />
          <DetailItem label="Bitiş Tarihi" value={maintenance.endDate?.split('T')[0]} />
          <DetailItem label="Pasaport Tarihi" value={maintenance.passportCreatedDate?.split('T')[0]} />
          <DetailItem label="Teklif Durumu" value={<Chip label={maintenance.offerStatus} size="small" />} />
          <DetailItem label="Sözleşme Durumu" value={<Chip label={maintenance.contractStatus} size="small" />} />
          <DetailItem label="Lisans Durumu" value={<Chip label={maintenance.licenseStatus} size="small" />} />
          <DetailItem label="Firma Durumu" value={<Chip label={maintenance.firmSituation} size="small" />} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Açıklama
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {maintenance.description || '-'}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          Ekli Ürünler
        </Typography>
        {maintenance.products && maintenance.products.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {maintenance.products.map((product) => (
              <Chip key={product.id} label={product.name} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Bu anlaşmaya ekli ürün bulunmamaktadır.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default MaintenanceDetail;
