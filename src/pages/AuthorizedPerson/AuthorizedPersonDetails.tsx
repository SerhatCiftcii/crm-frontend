// src/pages/authorizedperson/AuthorizedPersonDetails.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Divider, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchAuthorizedPersons } from '../../features/authorizedPerson/authorizedPersonSlice';
import { type AuthorizedPersonDto } from '../../types/authorizedPerson';

const AuthorizedPersonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(state => state.authorizedPerson);
  const customers = useAppSelector((state) => state.customer.customers);

  const [person, setPerson] = useState<AuthorizedPersonDto | null>(null);

  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(fetchAuthorizedPersons());
      return;
    }

    if (id) {
      const found = list.find((p: AuthorizedPersonDto) => p.id === parseInt(id));
      if (found) setPerson(found);
    }
  }, [list, id, dispatch]);

  if (loading || !person) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Şirket adı çözümü
  const companyName = person.customerName || customers.find(c => c.id === person.customerId)?.companyName || 'Belirtilmemiş';

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Yetkili Kişi Detayları</Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Şirket Adı</Typography>
        <Typography mb={2}>{companyName}</Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Yetkili Adı</Typography>
        <Typography mb={2}>{person.fullName}</Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Unvan</Typography>
        <Typography mb={2}>{person.title}</Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Telefon</Typography>
        <Typography mb={2}>{person.phone}</Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6">Email</Typography>
        <Typography mb={2}>{person.email}</Typography>

        {person.birthDate && (
          <>
            <Divider sx={{ mb: 2 }} />
             <Typography variant="h6">Doğum Tarihi</Typography>
    <Typography mb={2}>
      {new Date(person.birthDate).toLocaleDateString('tr-TR')}
    </Typography>
          </>
        )}

        {person.notes && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6">Notlar</Typography>
            <Typography mb={2}>{person.notes}</Typography>
          </>
        )}

      
    
            {person.updatedAt && new Date(person.updatedAt).getTime() !== new Date(person.createdAt).getTime() && (
        <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6">Güncelleme Tarihi</Typography>
            <Typography mb={2}>
            {new Date(person.updatedAt).toLocaleDateString('tr-TR')}
            </Typography>
        </>
        )}
        <Typography variant="h6">Oluşturulma Tarihi</Typography>
        <Typography mb={2}>{new Date(person.createdAt).toLocaleDateString('tr-TR')}</Typography>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/authorized-persons')}>
          Geri Dön
        </Button>
      </Box>
    </Box>
  );
};

export default AuthorizedPersonDetails;
