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
  List,
  ListItem,
  ListItemText,
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
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Geri Dön
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        {customer.companyName} - Detaylar
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Temel Bilgiler */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Temel Bilgiler</Typography>
          <List>
            <ListItem><ListItemText primary="Şirket Adı" secondary={customer.companyName} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Şube Adı" secondary={customer.branchName || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Yetkili Adı" secondary={customer.ownerName} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Email" secondary={customer.email} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Telefon" secondary={customer.phone || '-'} /></ListItem>
          </List>
        </Box>

        {/* Adres & Durum */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Adres & Durum</Typography>
          <List>
            <ListItem><ListItemText primary="Şehir" secondary={customer.city || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="İlçe" secondary={customer.district || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Adres" secondary={customer.address || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Vergi Numarası" secondary={customer.taxNumber || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Vergi Dairesi" secondary={customer.taxOffice || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Web Sitesi" secondary={customer.webSite || '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Satış Tarihi" secondary={customer.salesDate ? customer.salesDate.split('T')[0] : '-'} /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Durum" secondary={statusMap[customer.status]} /></ListItem>
          </List>
        </Box>

        {/* Ürünler */}
        <Box>
          <Typography variant="h6" gutterBottom>Ürünler</Typography>
          {customer.products && customer.products.length > 0 ? (
            <List>
              {customer.products.map((p) => (
                <ListItem key={p.id}><ListItemText primary={p.name} /></ListItem>
              ))}
            </List>
          ) : (
            <Typography>-</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerDetails;
