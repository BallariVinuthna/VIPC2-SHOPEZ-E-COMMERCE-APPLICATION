import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ToastContext } from '../context/ToastContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog state
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await api.post('/upload', formData, config);
      setImage(data.image);
      setUploading(false);
      showToast('Image uploaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      setFormError('Failed to upload image. Please try again.');
      setUploading(false);
      showToast('Image upload failed', 'error');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentId(null);
    setName('');
    setPrice('');
    setCategory('');
    setCountInStock('');
    setImage('');
    setDescription('');
    setFormError('');
    setOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditMode(true);
    setCurrentId(product._id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setCountInStock(product.countInStock);
    setImage(product.image);
    setDescription(product.description);
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        showToast('Product deleted successfully', 'info');
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !price || !category || !countInStock || !description) {
      const valErr = 'All fields marked as required must be filled';
      setFormError(valErr);
      showToast(valErr, 'warning');
      return;
    }

    const payload = {
      name,
      price: Number(price),
      category,
      countInStock: Number(countInStock),
      image: image || undefined,
      description
    };

    try {
      if (editMode) {
        await api.put(`/products/${currentId}`, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.post('/products', payload);
        showToast('Product created successfully!', 'success');
      }
      setOpen(false);
      fetchProducts();
    } catch (err) {
      const saveErr = err.response?.data?.message || 'Failed to save product';
      setFormError(saveErr);
      showToast(saveErr, 'error');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} component={Link} to="/admin" color="inherit">
            Dashboard
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Manage Products
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="warning"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </TableCell>
                <TableCell align="right" sx={{ color: product.countInStock > 0 ? 'text.primary' : 'error.main' }}>
                  {product.countInStock}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpenEdit(product)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'warning.main' }}>
          {editMode ? 'Edit Product' : 'Create Product'}
        </DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              fullWidth
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Price (₹)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Stock Quantity"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </Grid>
            </Grid>
            <TextField
              required
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Image URL"
                placeholder="Leave blank for default"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ minWidth: '150px', height: '56px' }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUploadFile}
                />
              </Button>
            </Box>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="warning">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProducts;
