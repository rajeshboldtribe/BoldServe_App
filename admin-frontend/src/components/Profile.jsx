import {
    Box,
    Paper,
    Typography,
    Grid,
    Avatar,
    IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useState } from 'react';

const Profile = () => {
    const [profileImage, setProfileImage] = useState(null);
    const vendorData = {
        vendorName: 'John Doe',
        vendorProduct: 'Electronics',
        contactNumber: '+1 234 567 8900',
        email: 'john.doe@example.com',
        shopName: 'Tech Solutions'
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setProfileImage(URL.createObjectURL(file));
        }
    };

    return (
        <Box sx={{ 
            p: 3, 
            marginLeft: '240px',  // Add margin to account for sidebar
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100vh'
        }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    maxWidth: 800,
                    width: '100%',
                    mt: 4  // Add some top margin
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    mb: 6 
                }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={profileImage}
                            sx={{
                                width: 150,
                                height: 150,
                                bgcolor: 'primary.main',
                                fontSize: '3rem',
                                mb: 2
                            }}
                        >
                            {!profileImage && vendorData.vendorName.charAt(0)}
                        </Avatar>
                        <IconButton 
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 0,
                                bgcolor: 'white',
                                '&:hover': { bgcolor: 'grey.100' },
                                boxShadow: 2
                            }}
                        >
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Vendor Profile
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Vendor Name:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {vendorData.vendorName}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Vendor Shop Name:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {vendorData.shopName}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Product Category:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {vendorData.vendorProduct}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Vendor Contact Number:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {vendorData.contactNumber}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Vendor Email ID:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {vendorData.email}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Profile;