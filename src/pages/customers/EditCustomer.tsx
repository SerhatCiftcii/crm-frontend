// src/pages/customers/EditCustomer.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCustomers, updateCustomer } from '../../features/customer/customerSlice';
import {
  type UpdateCustomerDto,
  type ProductDto,
  type CustomerChangeLogDto,
} from '../../types/customer';
import { productApi } from '../../services/productService';
import { customerService } from '../../services/customerService';

const statusOptions = {
  1: 'Aktif',
  2: 'Pasif',
  3: 'Beklemede',
};

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customers, loading, error } = useAppSelector((state) => state.customer);

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [formData, setFormData] = useState<UpdateCustomerDto | null>(null);

  // Change log dialog
  const [logOpen, setLogOpen] = useState(false);
  const [logs, setLogs] = useState<CustomerChangeLogDto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await productApi.getAllProducts();
        setProducts(productList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (customers.length > 0 && id) {
      const cust = customers.find(c => c.id === parseInt(id));
      if (cust) {
        setFormData({
          id: cust.id,
          companyName: cust.companyName,
          branchName: cust.branchName,
          ownerName: cust.ownerName,
          phone: cust.phone,
          email: cust.email,
          city: cust.city,
          district: cust.district,
          address: cust.address,
          taxNumber: cust.taxNumber,
          taxOffice: cust.taxOffice,
          webSite: cust.webSite,
          salesDate: cust.salesDate, // string | null
          status: cust.status,
          productIds: cust.products?.map(p => p.id) || [],
        });
      }
    }
  }, [customers, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (!formData) return;
    if (name === 'status') {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === 'productIds') {
      const selectedIds = (typeof value === 'string' ? value.split(',') : value).map(Number);
      setFormData({ ...formData, productIds: selectedIds });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    await dispatch(updateCustomer({ ...formData }));
    await dispatch(fetchCustomers());
    navigate('/customers');
  };

  const handleOpenLogs = async () => {
    if (!id) return;
    try {
      // ID'ye göre logları çekiyoruz
      const logsByCustomer = await customerService.getCustomerChangeLogsByCustomerId(Number(id));
      setLogs(logsByCustomer);
      setLogOpen(true);
    } catch (err) {
      console.error('Değişiklikler yüklenemedi.', err);
      setLogs([]);
      setLogOpen(true);
    }
  };

  const handleCloseLogs = () => setLogOpen(false);

  if (!formData) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Müşteri Düzenle</Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Şirket Adı" name="companyName" value={formData.companyName} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Şube Adı" name="branchName" value={formData.branchName} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Yetkili Adı" name="ownerName" value={formData.ownerName} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
        <TextField fullWidth margin="normal" label="Telefon" name="phone" value={formData.phone} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Şehir" name="city" value={formData.city} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="İlçe" name="district" value={formData.district} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Adres" name="address" value={formData.address} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Vergi Numarası" name="taxNumber" value={formData.taxNumber} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Vergi Dairesi" name="taxOffice" value={formData.taxOffice} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Web Sitesi" name="webSite" value={formData.webSite} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Satış Tarihi" name="salesDate" type="date" value={formData.salesDate || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />

        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Durum</InputLabel>
          <Select labelId="status-label" name="status" value={formData.status.toString()} onChange={handleSelectChange}>
            {Object.entries(statusOptions).map(([val, label]) => (
              <MenuItem key={val} value={val}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="product-label">Ürünler</InputLabel>
          <Select
            labelId="product-label"
            multiple
            name="productIds"
            value={formData.productIds}
            onChange={handleSelectChange}
            input={<OutlinedInput label="Ürünler" />}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" disabled={loading}>Güncelle</Button>
          <Button variant="outlined" color="error" onClick={() => navigate('/customers')}>İptal</Button>
          <Button variant="outlined" color="info" onClick={handleOpenLogs}>Değişiklikleri Gör</Button>
        </Box>
      </form>

      {/* Change log dialog */}
      <Dialog open={logOpen} onClose={handleCloseLogs} fullWidth maxWidth="sm">
        <DialogTitle>Değişiklikler</DialogTitle>
        <DialogContent dividers>
          {logs.length === 0 ? (
            <Typography>Değişiklik kaydı bulunmamaktadır.</Typography>
          ) : (
            <List>
              {logs.map((log) => (
                <ListItem key={log.id}>
                  <ListItemText
                    primary={`${log.fieldName} değişti: ${log.oldValue ?? '-'} → ${log.newValue ?? '-'}`}
                    secondary={`Değiştiren: ${log.changedBy} | Tarih: ${log.changedAt.split('T')[0]}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogs}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditCustomer;
