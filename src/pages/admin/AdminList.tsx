import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, IconButton, Tooltip, Alert, CircularProgress, Switch, Button, TablePagination
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAdmins, setAdminStatus, deleteAdmin } from '../../features/admin/adminSlice';
import { useNavigate } from 'react-router-dom';

const AdminList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector(s => s.admins);
  const { roles, isSuperAdmin, userId } = useAppSelector(s => s.auth);

  const canSeeMenu = roles.includes('Admin') || roles.includes('SuperAdmin');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRpp] = useState(10);

  useEffect(() => { dispatch(fetchAdmins()); }, [dispatch]);

  const handleToggle = (targetId: string, current: boolean) => {
    if (!isSuperAdmin) return; // UI guard
    dispatch(setAdminStatus({ userId: targetId, isActive: !current }))
      .unwrap()
      .then(() => dispatch(fetchAdmins()));
  };

  const handleDelete = (targetId: string) => {
    if (!isSuperAdmin) return;
    if (targetId === userId) {
      alert('Kendi hesabınızı silemezsiniz');
      return;
    }
    if (confirm('Yöneticiyi silmek istiyor musunuz?')) {
      dispatch(deleteAdmin(targetId));
    }
  };

  if (!canSeeMenu) return <Alert severity="warning">Yetkiniz yok.</Alert>;
  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress/></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h4">Yöneticiler</Typography>
        {isSuperAdmin ? (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admins/add')}>
            Yeni Admin Ekle
          </Button>
        ) : (
          <Tooltip title="Sadece listeleme yetkiniz var">
            <span><Button variant="contained" disabled startIcon={<AddIcon />}>Yeni Admin Ekle</Button></span>
          </Tooltip>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

      <Paper elevation={4}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell sx={{ fontWeight:'bold' }}>Kullanıcı Adı</TableCell>
                <TableCell sx={{ fontWeight:'bold' }}>Ad Soyad</TableCell>
                <TableCell sx={{ fontWeight:'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight:'bold' }}>Telefon</TableCell>
                <TableCell sx={{ fontWeight:'bold' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight:'bold' }}>Aktif</TableCell>
                <TableCell align="center" sx={{ fontWeight:'bold', width: 120 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((a, i) => (
                <TableRow key={a.id} hover sx={{ bgcolor: i % 2 === 0 ? 'grey.50' : 'background.paper' }}>
                  <TableCell>{a.username}</TableCell>
                  <TableCell>{a.fullName}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.phoneNumber || '-'}</TableCell>
                  <TableCell>{a.isSuperAdmin ? 'SuperAdmin' : 'Admin'}</TableCell>
                  <TableCell>
                    <Tooltip title={isSuperAdmin && !a.isSuperAdmin ? 'Aktif/Pasif değiştir' : a.isSuperAdmin ? 'SuperAdmin durumu değiştirilemez' : 'Yetkiniz yok'}>
                      <span>
                        <Switch
                          checked={a.isActive}
                          onChange={() => handleToggle(a.id, a.isActive)}
                          disabled={!isSuperAdmin || a.isSuperAdmin}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={isSuperAdmin && !a.isSuperAdmin ? 'Sil' : a.isSuperAdmin ? 'SuperAdmin silinemez' : 'Yetkiniz yok'}>
                      <span>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(a.id)}
                          disabled={!isSuperAdmin || a.isSuperAdmin}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5,10,25,50]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRpp(parseInt(e.target.value,10)); setPage(0); }}
        />
      </Paper>
    </Box>
  );
};

export default AdminList;
