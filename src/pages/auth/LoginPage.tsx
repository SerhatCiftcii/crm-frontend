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
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from '../../features/auth/authThunks';
import { Navigate, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (token) return <Navigate to="/dashboard" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
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
      <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <LockOutlined color="primary" fontSize="large" />
          </Box>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            CRM Giriş Paneli
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={2}>
            Lütfen kullanıcı adı ve şifrenizi girin
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Kullanıcı Adı"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, py: 1.2, textTransform: 'none', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <Typography mt={2} align="center" fontSize="0.9rem">
            Hesabınız yok mu?{' '}
            <Link component="button" variant="body2" onClick={() => navigate('/register')}>
              Kayıt Ol
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
