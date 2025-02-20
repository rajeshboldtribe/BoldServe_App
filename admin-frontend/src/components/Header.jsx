import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Box,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    ListItemIcon,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const Header = ({ setIsAuthenticated }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const drawerWidth = 240;
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotificationCount();
        // Poll for new notifications every minute
        const interval = setInterval(fetchNotificationCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotificationCount = async () => {
        try {
            const response = await api.get('/orders/status/pending');
            setNotificationCount(response.data.length);
        } catch (error) {
            console.error('Error fetching notification count:', error);
            setNotificationCount(0);
        }
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        handleClose();
    };

    const handleProfileNav = () => {
        navigate('/profile');
        handleClose();
    };

    const handleNotificationClick = () => {
        navigate('/notifications');
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                bgcolor: 'white',
                color: 'text.primary',
                boxShadow: 1
            }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Welcome to BoldServe Admin Panel
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton 
                        color="inherit"
                        onClick={handleNotificationClick}
                    >
                        {notificationCount > 0 ? (
                            <Badge badgeContent={notificationCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        ) : (
                            <NotificationsIcon />
                        )}
                    </IconButton>
                    
                    <IconButton color="inherit">
                        <SettingsIcon />
                    </IconButton>

                    <IconButton 
                        onClick={handleProfileClick}
                        size="small"
                    >
                        <Avatar 
                            sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: 'primary.main'
                            }}
                        >
                            A
                        </Avatar>
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleProfileNav}>
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <Typography color="error">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;