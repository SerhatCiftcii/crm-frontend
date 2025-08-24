// src/pages/customers/CustomerList.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  TablePagination,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCustomers, deleteCustomer } from '../../features/customer/customerSlice';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';

const statusMap: { [key: number]: { label: string; color: 'success' | 'warning' | 'default' } } = {
  1: { label: 'Aktif', color: 'success' },
  2: { label: 'Pasif', color: 'default' },
  3: { label: 'Beklemede', color: 'warning' },
};

const CustomerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customers, loading, error } = useAppSelector((state) => state.customer);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Müşteriyi silmek istediğinizden emin misiniz?')) {
      dispatch(deleteCustomer(id));
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/customers/edit/${id}`);
  };

  const handleAdd = () => {
    navigate(`/customers/add`);
  };

  const handleDownloadChangeLog = async () => {
    try {
      const blob = await customerService.getCustomerChangeLogExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CustomerChangeLog.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Excel indirme sırasında hata oluştu.');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Müşteriler</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
            Yeni Müşteri Ekle
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadChangeLog}
          >
            Değişiklikleri Excel
          </Button>
        </Box>
      </Box>

      {customers.length === 0 ? (
        <Alert severity="info">Henüz müşteri kaydı bulunmamaktadır.</Alert>
      ) : (
        <Paper elevation={4} sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Şirket Adı</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Yetkili Adı</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Telefon</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Şehir</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ürünler</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    İşlemler
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    hover
                    sx={{ bgcolor: index % 2 === 0 ? 'grey.50' : 'background.paper' }}
                  >
                    <TableCell>{customer.companyName}</TableCell>
                    <TableCell>{customer.ownerName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusMap[customer.status]?.label || 'Bilinmiyor'}
                        color={statusMap[customer.status]?.color || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {customer.products?.map((p) => p.name).join(', ') || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Detaylar">
                        <IconButton color="info" onClick={() => navigate(`/customers/${customer.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Düzenle">
                        <IconButton color="primary" onClick={() => handleEdit(customer.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton color="error" onClick={() => handleDelete(customer.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default CustomerList;
