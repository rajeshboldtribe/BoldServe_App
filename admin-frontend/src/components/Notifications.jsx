import { 
    Box, 
    Typography, 
    List,
    ListItem,
    ListItemText,
    Avatar,
    Divider,
    Paper
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import api from '../utils/axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const [ordersResponse, paymentsResponse] = await Promise.all([
                api.get('/orders'),
                api.get('/orders/status/pending')
            ]);

            const allNotifications = [
                ...ordersResponse.data.map(order => ({
                    id: order._id,
                    type: 'order',
                    status: order.status,
                    message: `Order #${order._id.slice(-4)} ${order.status}`,
                    timestamp: new Date(order.updatedAt),
                    amount: order.totalAmount
                })),
                ...paymentsResponse.data.map(payment => ({
                    id: payment._id,
                    type: 'payment',
                    status: payment.status,
                    message: `Payment ${payment.status} for Order #${payment.orderId.slice(-4)}`,
                    timestamp: new Date(payment.updatedAt),
                    amount: payment.amount
                }))
            ].sort((a, b) => b.timestamp - a.timestamp);

            setNotifications(allNotifications);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ maxWidth: 800, mx: 'auto' }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6">
                        Notifications
                    </Typography>
                </Box>
                <List>
                    {notifications.map((notification) => (
                        <Box key={notification.id}>
                            <ListItem
                                sx={{
                                    bgcolor: 
                                        notification.status === 'accepted' || 
                                        notification.status === 'success' 
                                            ? 'success.light'
                                            : notification.status === 'rejected' || 
                                              notification.status === 'failed'
                                                ? 'error.light'
                                                : 'inherit'
                                }}
                            >
                                <Avatar sx={{ 
                                    bgcolor: 
                                        notification.status === 'accepted' || 
                                        notification.status === 'success'
                                            ? 'success.main'
                                            : notification.status === 'rejected' || 
                                              notification.status === 'failed'
                                                ? 'error.main'
                                                : 'primary.main',
                                    mr: 2
                                }}>
                                    {notification.status === 'accepted' || 
                                     notification.status === 'success' ? (
                                        <CheckIcon />
                                    ) : notification.status === 'rejected' || 
                                         notification.status === 'failed' ? (
                                        <ClearIcon />
                                    ) : null}
                                </Avatar>
                                <ListItemText
                                    primary={notification.message}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2">
                                                Amount: ₹{notification.amount}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="caption" color="textSecondary">
                                                {notification.timestamp.toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </Box>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default Notifications;