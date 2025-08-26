// src/pages/customers/CustomerDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { type CustomerDto } from '../../types/customer';

const statusMap: { [key: number]: string } = {
  1: 'Aktif',
  2: 'Pasif',
  3: 'Beklemede',
};

const statusColorMap: { [key: number]: 'success' | 'default' | 'warning' } = {
  1: 'success',
  2: 'default',
  3: 'warning',
};

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector((state) => state.customer);
  const [customer, setCustomer] = useState<CustomerDto | null>(null);

  useEffect(() => {
    if (customers.length === 0) {
      dispatch(fetchCustomers());
    } else {
      const found = customers.find((c) => c.id === Number(id));
      setCustomer(found || null);
    }
  }, [customers, dispatch, id]);

  useEffect(() => {
    if (customers.length > 0 && !customer) {
      const found = customers.find((c) => c.id === Number(id));
      setCustomer(found || null);
    }
  }, [customers, customer, id]);

  if (loading) {
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
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">Müşteri bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
        mb: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 900, // Daha geniş kart
          position: 'relative',
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          Geri Dön
        </Button>

        <Typography variant="h4" component="h1" gutterBottom align="center">
          {customer.companyName} - Detaylar
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Temel Bilgiler</Typography>
          <Stack spacing={1} divider={<Divider />}>
            <Typography><strong>Şirket Adı:</strong> {customer.companyName}</Typography>
            <Typography><strong>Şube Adı:</strong> {customer.branchName || '-'}</Typography>
            <Typography><strong>Yetkili Adı:</strong> {customer.ownerName}</Typography>
            <Typography><strong>Email:</strong> {customer.email}</Typography>
            <Typography><strong>Telefon:</strong> {customer.phone || '-'}</Typography>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Adres & Durum</Typography>
          <Stack spacing={1} divider={<Divider />}>
            <Typography><strong>Şehir:</strong> {customer.city || '-'}</Typography>
            <Typography><strong>İlçe:</strong> {customer.district || '-'}</Typography>
            <Typography><strong>Adres:</strong> {customer.address || '-'}</Typography>
            <Typography><strong>Vergi Numarası:</strong> {customer.taxNumber || '-'}</Typography>
            <Typography><strong>Vergi Dairesi:</strong> {customer.taxOffice || '-'}</Typography>
            <Typography><strong>Web Sitesi:</strong> {customer.webSite || '-'}</Typography>
            <Typography><strong>Satış Tarihi:</strong> {customer.salesDate ? customer.salesDate.split('T')[0] : '-'}</Typography>
            <Typography>
              <strong>Durum:</strong>{' '}
              <Chip label={statusMap[customer.status]} color={statusColorMap[customer.status]} size="small" />
            </Typography>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Ürünler</Typography>
          {customer.products && customer.products.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {customer.products.map((p) => (
                <Chip key={p.id} label={p.name} />
              ))}
            </Stack>
          ) : (
            <Typography>-</Typography>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default CustomerDetails;
