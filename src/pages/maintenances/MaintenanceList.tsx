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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMaintenances, deleteMaintenance } from '../../features/maintenance/maintenanceSlice';
import { fetchCustomers } from '../../features/customer/customerSlice';
import { useNavigate } from 'react-router-dom';

// Sadece Chip renklerini belirlemek için map
const chipColorMap: Record<string | number, "default" | "success" | "warning" | "error" | "info"> = {
  0: "default",
  1: "info",
  2: "success",
  3: "warning",
  4: "error",
  "Hazırlanmadı": "default",
  "Hazırlandı": "info",
  "Gönderildi": "warning",
  "Onaylandı": "success",
  "Reddedildi": "error",
  "Gönderilmedi": "default",
  "İmzalandı": "success",
  "İptal Edildi": "error",
  "Aktif": "success",
  "Pasif": "default",
  "Bekliyor": "warning",
  "Süresi Doldu": "error",
  "Devam Ediyor": "info",
  "Durduruldu": "warning",
  "Tamamlandı": "success",
};

const MaintenanceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { maintenances, loading, error } = useAppSelector((state) => state.maintenance);
  const { customers, loading: customersLoading } = useAppSelector((state) => state.customer);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchMaintenances());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Bakım anlaşmasını silmek istediğinizden emin misiniz?')) {
      dispatch(deleteMaintenance(id));
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/maintenances/edit/${id}`);
  };

  const handleAdd = () => {
    navigate(`/maintenances/add`);
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCustomerNameById = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || "Bilinmiyor";
  };

  if (loading || customersLoading)
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
        <Typography variant="h4">Bakım Anlaşmaları</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
          Yeni Bakım Anlaşması Ekle
        </Button>
      </Box>

      {maintenances.length === 0 ? (
        <Alert severity="info">Henüz bakım anlaşması kaydı bulunmamaktadır.</Alert>
      ) : (
        <Paper elevation={4} sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: '70vh' }}>
            <Table stickyHeader sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Müşteri</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Konu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Başlangıç Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bitiş Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Teklif Durumu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sözleşme Durumu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Lisans Durumu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Firma Durumu</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    İşlemler
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenances
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((maintenance, index) => (
                    <TableRow
                      key={maintenance.id}
                      hover
                      sx={{ bgcolor: index % 2 === 0 ? 'grey.50' : 'background.paper' }}
                    >
                      <TableCell>{getCustomerNameById(maintenance.customerId)}</TableCell>
                      <TableCell>{maintenance.subject || getCustomerNameById(maintenance.customerId)}</TableCell>
                      <TableCell>{maintenance.startDate?.split('T')[0] || '-'}</TableCell>
                      <TableCell>{maintenance.endDate?.split('T')[0] || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={maintenance.offerStatus}
                          size="small"
                          color={chipColorMap[maintenance.offerStatus] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={maintenance.contractStatus}
                          size="small"
                          color={chipColorMap[maintenance.contractStatus] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={maintenance.licenseStatus}
                          size="small"
                          color={chipColorMap[maintenance.licenseStatus] || 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={maintenance.firmSituation}
                          size="small"
                          color={chipColorMap[maintenance.firmSituation] || 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Detaylar">
                          <IconButton color="info" onClick={() => navigate(`/maintenances/${maintenance.id}`)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton color="primary" onClick={() => handleEdit(maintenance.id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton color="error" onClick={() => handleDelete(maintenance.id)}>
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
            count={maintenances.length}
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

export default MaintenanceList;
