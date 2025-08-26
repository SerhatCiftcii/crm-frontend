// src/pages/authorizedperson/AuthorizedPersonDetails.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Divider, Button, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchAuthorizedPersons } from '../../features/authorizedPerson/authorizedPersonSlice';
import { type AuthorizedPersonDto } from '../../types/authorizedPerson';

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

  if (loading || !person)
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const companyName = person.customerName || customers.find(c => c.id === person.customerId)?.companyName || 'Belirtilmemiş';

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Yetkili Kişi Detayları</Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={1}>
          <DetailItem label="Şirket Adı" value={companyName} />
          <Divider />
          <DetailItem label="Yetkili Adı" value={person.fullName} />
          <Divider />
          <DetailItem label="Unvan" value={person.title} />
          <Divider />
          <DetailItem label="Telefon" value={person.phone} />
          <Divider />
          <DetailItem label="Email" value={person.email} />
          {person.birthDate && (
            <>
              <Divider />
              <DetailItem
                label="Doğum Tarihi"
                value={new Date(person.birthDate).toLocaleDateString('tr-TR')}
              />
            </>
          )}
          {person.notes && (
            <>
              <Divider />
              <DetailItem label="Notlar" value={person.notes} />
            </>
          )}
          {person.updatedAt && new Date(person.updatedAt).getTime() !== new Date(person.createdAt).getTime() && (
            <>
              <Divider />
              <DetailItem
                label="Güncelleme Tarihi"
                value={new Date(person.updatedAt).toLocaleDateString('tr-TR')}
              />
            </>
          )}
          <Divider />
          <DetailItem label="Oluşturulma Tarihi" value={new Date(person.createdAt).toLocaleDateString('tr-TR')} />
        </Stack>
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
