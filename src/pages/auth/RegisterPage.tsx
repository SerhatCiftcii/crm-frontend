import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  IconButton,
  InputAdornment,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PersonAddOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !fullName || !email || !password) {
      setError('Tüm zorunlu alanları doldurun');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Geçerli bir email girin');
      return;
    }

    try {
      setLoading(true);
      await authService.register({ username, fullName, email, password, phoneNumber });
      setSuccessMessage('Kayıt başarılı! Super admin onayı bekleniyor.');
      setUsername('');
      setFullName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Bu kullanıcı adı veya email zaten kayıtlı veya geçersiz veri.');
      } else {
        setError(err.message || 'Kayıt sırasında bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)'
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <PersonAddOutlined color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            Yeni Hesap Oluştur
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={2}>
            Lütfen bilgilerinizi doldurun
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Kullanıcı Adı"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Ad Soyad"
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="En az 6 karakter"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Telefon (opsiyonel)"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.2, textTransform: 'none', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
          </form>

          <Typography mt={2} align="center" fontSize="0.9rem">
            Zaten hesabınız var mı?{' '}
            <Link component="button" variant="body2" onClick={() => navigate('/login')}>
              Giriş Yap
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
