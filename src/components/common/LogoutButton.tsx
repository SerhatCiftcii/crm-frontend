import React from 'react';
import { Button } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // logout sonrası login sayfasına yönlendir
  };

  return (
    <Button variant="outlined" color="warning" onClick={handleLogout}>
      Çıkış
    </Button>
  );
};

export default LogoutButton;
