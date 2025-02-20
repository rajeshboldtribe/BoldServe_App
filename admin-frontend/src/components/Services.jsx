import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
} from '@mui/material';
import { categoriesWithSubs } from '../utils/categories';
import axios from '../utils/axios'; // Make sure you have axios configured

const VALID_CATEGORIES = {
  'Office Stationaries': [
    'Notebooks & Papers',
    'Adhesive & Glue',
    'Pen & Pencil Kits',
    'Whitener & Markers',
    'Stapler & Scissors',
    'Calculator'
  ]
};

const Services = () => {
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    productName: '',
    price: '',
    description: '',
    offers: '',
    review: '',
    rating: '',
    images: new Array(6).fill(null), // Changed to 6 slots
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCategoryChange = (event) => {
    setFormData({ 
      ...formData, 
      category: event.target.value,
      subCategory: '' // Reset subcategory when category changes
    });
  };

  // Handle individual image upload
  const handleSingleImageChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData({
        ...formData,
        images: newImages
      });
    }
  };

  // Clear individual image
  const handleClearImage = (index) => () => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const serviceData = new FormData();
      
      // Add debug logging
      console.log('Selected Category:', formData.category);
      console.log('Selected SubCategory:', formData.subCategory);
      
      // Validate category and subcategory
      if (!formData.category || !categoriesWithSubs[formData.category]) {
        setSnackbar({
          open: true,
          message: 'Please select a valid category',
          severity: 'error'
        });
        return;
      }

      if (!formData.subCategory || !categoriesWithSubs[formData.category].includes(formData.subCategory)) {
        setSnackbar({
          open: true,
          message: 'Please select a valid subcategory',
          severity: 'error'
        });
        return;
      }

      // Ensure exact category name match
      const formattedData = {
        ...formData,
        category: formData.category === 'IT Service and Repairs' ? 'IT Service and Repairs' : formData.category.trim(),
        subCategory: formData.subCategory.trim(),
        productName: formData.productName.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        offers: formData.offers ? formData.offers.trim() : '',
        review: formData.review ? formData.review.trim() : '',
        rating: formData.rating ? Number(formData.rating) : 0
      };
      
      console.log('Sending service data:', formattedData);
      
      // Add all form fields except images
      Object.keys(formattedData).forEach(key => {
        if (key !== 'images') {
          serviceData.append(key, formattedData[key]);
        }
      });

      // Add only non-null images
      formData.images.forEach((image, index) => {
        if (image) {
          serviceData.append('images', image);
        }
      });

      const response = await axios.post('/services', serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Service created:', response.data);
      
      setSnackbar({
        open: true,
        message: `Product successfully added to ${formData.subCategory}!`,
        severity: 'success'
      });

      // Clear form after successful submission
      setFormData({
        category: '',
        subCategory: '',
        productName: '',
        price: '',
        description: '',
        offers: '',
        review: '',
        rating: '',
        images: new Array(6).fill(null), // Reset images
      });

    } catch (error) {
      console.error('Error creating service:', error);
      console.error('Error response:', error.response?.data);  // Add this line
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error creating service. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <Box
      sx={{
        marginLeft: '240px',
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          mt: 4,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            label="Category"
          >
            {Object.keys(categoriesWithSubs).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Sub Category</InputLabel>
          <Select
            value={formData.subCategory}
            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
            label="Sub Category"
            disabled={!formData.category} // Disable if no category selected
          >
            {formData.category && categoriesWithSubs[formData.category].map((subCategory) => (
              <MenuItem key={subCategory} value={subCategory}>
                {subCategory}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Product Name"
          sx={{ mb: 2 }}
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
        />

        <TextField
          fullWidth
          label="Price (INR)"
          type="number"
          sx={{ mb: 2 }}
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          InputProps={{
            startAdornment: '₹',
          }}
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          sx={{ mb: 2 }}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <TextField
          fullWidth
          label="Offers"
          sx={{ mb: 2 }}
          value={formData.offers}
          onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
        />

        <TextField
          fullWidth
          label="Review"
          sx={{ mb: 2 }}
          value={formData.review}
          onChange={(e) => setFormData({ ...formData, review: e.target.value })}
        />

        <TextField
          fullWidth
          label="Rating"
          type="number"
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          sx={{ mb: 2 }}
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Additional Images (Max 6)
          </Typography>
          
          <Grid container spacing={2}>
            {formData.images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    border: '1px dashed #ccc',
                    borderRadius: 1,
                    p: 2,
                    mb: 2,
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Image {index + 1}
                  </Typography>
                  
                  {image ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" noWrap>
                        {image.name}
                      </Typography>
                      <Box sx={{ mt: 1, flex: 1, position: 'relative' }}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      </Box>
                      <Button
                        size="small"
                        color="error"
                        onClick={handleClearImage(index)}
                        sx={{ mt: 1 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <input
                        accept="image/*"
                        type="file"
                        id={`image-upload-${index}`}
                        style={{ display: 'none' }}
                        onChange={handleSingleImageChange(index)}
                      />
                      <label htmlFor={`image-upload-${index}`}>
                        <Button
                          component="span"
                          variant="outlined"
                          size="small"
                          sx={{
                            width: '100%',
                            height: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                              Click to Upload
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Image {index + 1}
                            </Typography>
                          </Box>
                        </Button>
                      </label>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            background: 'linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        >
          Post Data
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Services;