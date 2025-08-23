import React from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../../components/common/Header';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Header />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography mt={1}>Giriş başarılı. Burayı sonra dolduracağız.</Typography>
      </Box>
    </>
  );
};

export default DashboardPage;
