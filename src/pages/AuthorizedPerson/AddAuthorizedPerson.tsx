import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addAuthorizedPerson, fetchAuthorizedPersons } from '../../features/authorizedPerson/authorizedPersonSlice';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddAuthorizedPerson: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const customers = useAppSelector((s) => s.customer.customers);

  const [form, setForm] = useState({
    customerId: '',
    fullName: '',
    title: '',
    phone: '',
    email: '',
    birthDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState({
    customerId: '',
    fullName: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    let valid = true;
    const newErrors = { customerId: '', fullName: '', email: '', phone: '' };

    if (!form.customerId) {
      newErrors.customerId = 'Şirket adı zorunludur.';
      valid = false;
    }
    if (!form.fullName) {
      newErrors.fullName = 'Ad Soyad alanı zorunludur.';
      valid = false;
    }
    if (!form.email) {
      newErrors.email = 'Lütfen bu alanı doldurun';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Geçerli bir e-posta giriniz';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await dispatch(
      addAuthorizedPerson({
        ...form,
        customerId: Number(form.customerId),
        birthDate: form.birthDate || undefined,
      })
    ).unwrap();

    await dispatch(fetchAuthorizedPersons()); // Listeyi güncelle
    navigate('/authorized-persons');
  };

  return (
    <Box p={2} maxWidth="600px" mx="auto">
      <Typography variant="h5" mb={3}>Yeni Yetkili Kişi Ekle</Typography>

      <TextField
        select
        fullWidth
        label="Şirket"
        name="customerId"
        value={form.customerId}
        onChange={handleChange}
        margin="normal"
        error={!!errors.customerId}
        helperText={errors.customerId}
        required
      >
        {customers.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.companyName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Ad Soyad"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        margin="normal"
        error={!!errors.fullName}
        helperText={errors.fullName}
        required
      />

      <TextField fullWidth label="Unvan" name="title" value={form.title} onChange={handleChange} margin="normal" />

      <TextField
        fullWidth
        label="Telefon"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        margin="normal"
        error={!!errors.phone}
        helperText={errors.phone}
      />

      <TextField
        fullWidth
        label="E-Posta"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        error={!!errors.email}
        helperText={errors.email}
        required
      />

      <TextField
        fullWidth
        type="date"
        name="birthDate"
        value={form.birthDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Notlar"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />

      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" onClick={handleSubmit}>Kaydet</Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>İptal</Button>
      </Box>
    </Box>
  );
};

export default AddAuthorizedPerson;
