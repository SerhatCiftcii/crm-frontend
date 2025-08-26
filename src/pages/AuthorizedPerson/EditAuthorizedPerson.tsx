import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, CircularProgress, Alert, MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  fetchAuthorizedPersons,
  updateAuthorizedPerson,
} from '../../features/authorizedPerson/authorizedPersonSlice';
import { type UpdateAuthorizedPersonDto } from '../../types/authorizedPerson';

const EditAuthorizedPerson: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { list, loading, error } = useAppSelector((s) => s.authorizedPerson);
  const customers = useAppSelector((s) => s.customer.customers);

  const [form, setForm] = useState<UpdateAuthorizedPersonDto>({
    id: 0,
    customerId: 0,
    fullName: '',
    title: '',
    phone: '',
    email: '',
    birthDate: '', // boşsa undefined göndereceğiz
    notes: '',
  });

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(fetchAuthorizedPersons());
      return;
    }

    if (id) {
      const found = list.find((p) => p.id === parseInt(id));
      if (found) {
        setForm({
          id: found.id,
          customerId: found.customerId,
          fullName: found.fullName || '',
          title: found.title || '',
          phone: found.phone || '',
          email: found.email || '',
          birthDate: found.birthDate || '', // boşsa ''
          notes: found.notes || '',
        });
      } else {
        setLocalError('Yetkili kişi bulunamadı.');
      }
    }
  }, [list, id, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'customerId'
          ? Number(value) 
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   
    const payload: UpdateAuthorizedPersonDto = {
      ...form,
      birthDate: form.birthDate || undefined,
    };

    try {
      await dispatch(updateAuthorizedPerson(payload)).unwrap();
      navigate('/authorized-persons');
    } catch (err: any) {
      setLocalError(err || 'Güncelleme sırasında bir hata oluştu.');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>
        Yetkili Kişi Düzenle
      </Typography>

      {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Müşteri"
          name="customerId"
          value={form.customerId}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        >
          {customers.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.companyName}</MenuItem>
          ))}
        </TextField>

        <TextField fullWidth label="Ad Soyad" name="fullName" value={form.fullName} onChange={handleChange} sx={{ mb: 2 }} required />
        <TextField fullWidth label="Unvan" name="title" value={form.title} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Telefon" name="phone" value={form.phone} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} required />
        <TextField fullWidth type="date" label="Doğum Tarihi" name="birthDate" value={form.birthDate} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField fullWidth label="Notlar" name="notes" value={form.notes} onChange={handleChange} sx={{ mb: 2 }} multiline rows={3} />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained">{loading ? 'Güncelleniyor...' : 'Güncelle'}</Button>
          <Button variant="outlined" onClick={() => navigate('/authorized-persons')}>İptal</Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditAuthorizedPerson;
