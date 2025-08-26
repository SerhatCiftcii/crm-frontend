import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
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
  TextField,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAuthorizedPersons,
  deleteAuthorizedPerson,
} from '../../features/authorizedPerson/authorizedPersonSlice';
import { useNavigate } from 'react-router-dom';

const AuthorizedPersonList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useAppSelector((s) => s.authorizedPerson);
  const customers = useAppSelector((s) => s.customer.customers);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAuthorizedPersons());
  }, [dispatch]);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`${name} silmek istediğinizden emin misiniz?`)) {
      dispatch(deleteAuthorizedPerson(id));
    }
  };

  const getCustomerName = (ap: any) =>
    ap.customerName || customers.find((c) => c.id === ap.customerId)?.companyName || ap.customerId;

  // --- Search filter ---
  const filteredList = list.filter((ap) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const match = (value?: string) => value?.toLowerCase().includes(term);
    return (
      match(getCustomerName(ap)) ||
      match(ap.fullName) ||
      match(ap.email) ||
      match(ap.phone)
    );
  });

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <p style={{ color: 'red' }}>{error}</p>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h2>Yetkililer</h2>
        <Button
          variant="contained"
          onClick={() => navigate('/authorized-persons/add')}
        >
          Yeni Yetkili Ekle
        </Button>
      </Box>

      {/* Arama alanı */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Ara..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={() => setSearchTerm('')}>Temizle</Button>
      </Box>

      {filteredList.length === 0 ? (
        <p>Henüz yetkili kaydı bulunmamaktadır.</p>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Oluşturulma Tarihi</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ap, index) => (
                    <TableRow
                      key={ap.id}
                      hover
                      sx={{ bgcolor: index % 2 === 0 ? 'grey.50' : 'background.paper' }}
                    >
                      <TableCell>{getCustomerName(ap)}</TableCell>
                      <TableCell>{ap.fullName}</TableCell>
                      <TableCell>{ap.email}</TableCell>
                      <TableCell>{ap.phone}</TableCell>
                      <TableCell>{new Date(ap.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Detaylar">
                          <IconButton color="info" onClick={() => navigate(`/authorized-persons/details/${ap.id}`)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton color="primary" onClick={() => navigate(`/authorized-persons/edit/${ap.id}`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton color="error" onClick={() => handleDelete(ap.id, ap.fullName)}>
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
            count={filteredList.length}
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

export default AuthorizedPersonList;
