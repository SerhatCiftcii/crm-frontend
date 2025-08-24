import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addAdmin } from '../../features/admin/adminSlice';
import { useNavigate } from 'react-router-dom';

const AddAdmin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAppSelector(s => s.auth);
  const { loading, error } = useAppSelector(s => s.admins);

  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
  });

  if (!isSuperAdmin) {
    return <Alert severity="warning" sx={{ m: 3 }}>Yetkiniz yok. (Sadece SuperAdmin yeni admin ekleyebilir)</Alert>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await dispatch(addAdmin(form as any)).unwrap().then(() => true).catch(() => false);
    if (ok) navigate('/admins');
  };

  return (
    <Box sx={{ p: 3, display:'grid', placeItems:'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 520 }}>
        <Typography variant="h5" mb={2}>Yeni Admin Ekle</Typography>
        {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField name="username" label="Kullanıcı Adı" value={form.username} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="fullName" label="Ad Soyad" value={form.fullName} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="phoneNumber" label="Telefon" value={form.phoneNumber} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="password" label="Şifre" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddAdmin;
