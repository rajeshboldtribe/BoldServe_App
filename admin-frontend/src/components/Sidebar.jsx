import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Build as ServicesIcon,
    ShoppingCart as OrdersIcon,
    People as UsersIcon,
    Payments as PaymentsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logo from '../assets/BoldTribe_Logo-removebg-preview.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Styled components for animations
const AnimatedListItem = styled(ListItem)(({ theme }) => ({
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateX(5px)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: '-100%',
        top: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
        transition: 'all 0.5s ease',
    },
    '&:hover::before': {
        left: '100%',
    }
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        // New gradient options - choose one of these:
        // Option 1: Blue-Purple Gradient
        background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
        
        // Option 2: Deep Purple Gradient
        // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        
        // Option 3: Ocean Blue Gradient
        // background: 'linear-gradient(135deg, #4CA1AF 0%, #2C3E50 100%)',
        
        // Option 4: Midnight Blue Gradient
        // background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        
        // Option 5: Royal Blue Gradient
        // background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',

        color: '#fff',
        width: 240,
        boxSizing: 'border-box',
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
        '& .MuiListItemIcon-root': {
            color: 'rgba(255, 255, 255, 0.9)',
        },
        '& .MuiListItemText-primary': {
            color: 'rgba(255, 255, 255, 0.9)',
        }
    }
}));

const LogoBox = styled(Box)({
    padding: '20px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    marginBottom: '10px',
    '& img': {
        maxWidth: '150px',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
        }
    }
});

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedItem] = useState(location.pathname);

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Services', icon: <ServicesIcon />, path: '/services' },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
        { text: 'Users', icon: <UsersIcon />, path: '/users' },
        { text: 'Payments', icon: <PaymentsIcon />, path: '/payments' },
    ];

    return (
        <StyledDrawer variant="permanent">
            <LogoBox>
                <img 
                    src={logo} 
                    alt="Logo"
                    style={{
                        width: 'auto',
                        maxWidth: '180px'
                    }}
                />
            </LogoBox>
            <List sx={{ padding: '10px' }}>
                {menuItems.map((item) => (
                    <AnimatedListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        component={Link}
                        to={item.path}
                        className={selectedItem === item.path ? 'active' : ''}
                        sx={{
                            margin: '4px 0',
                            borderRadius: '8px',
                            backgroundColor: selectedItem === item.path 
                                ? 'rgba(255, 255, 255, 0.2)' 
                                : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            }
                        }}
                    >
                        <ListItemIcon 
                            sx={{ 
                                color: selectedItem === item.path 
                                    ? '#fff' 
                                    : 'rgba(255, 255, 255, 0.8)',
                                transition: 'all 0.3s ease',
                                transform: selectedItem === item.path ? 'scale(1.1)' : 'scale(1)',
                                minWidth: '40px'
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.text}
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: selectedItem === item.path 
                                        ? '#fff' 
                                        : 'rgba(255, 255, 255, 0.8)',
                                    fontWeight: selectedItem === item.path ? 600 : 400,
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        />
                    </AnimatedListItem>
                ))}
            </List>
        </StyledDrawer>
    );
};

export default Sidebar;