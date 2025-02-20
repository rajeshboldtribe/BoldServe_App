import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  styled,
  Alert
} from '@mui/material';
import { paymentAPI } from '../utils/axios';

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(33, 147, 176, 0.1);
    transform: scale(1.01);
  }
`;

const Payments = () => {
  const [tabValue, setTabValue] = useState(0);
  const [successfulPayments, setSuccessfulPayments] = useState([]);
  const [cancelledPayments, setCancelledPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both types of payments
        const [successResponse, cancelResponse] = await Promise.all([
          paymentAPI.getSuccessfulPayments(),
          paymentAPI.getCancelledPayments()
        ]);

        setSuccessfulPayments(successResponse.data);
        setCancelledPayments(cancelResponse.data);

      } catch (err) {
        console.error('Error fetching payments:', err);
        setError(
          `Failed to load payments: ${err.message}. ` +
          'Please check your backend connection and API endpoints.'
        );
        setSuccessfulPayments([]);
        setCancelledPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        marginLeft: '240px'
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading payments...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        marginLeft: '240px'
      }}>
        <Alert severity="error" sx={{ width: '80%', maxWidth: '600px' }}>
          {error}
        </Alert>
        <Typography sx={{ mt: 2 }}>
          Please check:
          <ul>
            <li>The backend server is running on port 8003</li>
            <li>You are properly authenticated</li>
            <li>The API endpoints are correctly configured</li>
          </ul>
        </Typography>
      </Box>
    );
  }

  const renderPaymentTable = (payments) => (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Customer Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <StyledTableRow key={payment._id}>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>{payment.customerName}</TableCell>
                <TableCell>₹{payment.amount}</TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: payment.status === 'successful' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}
                  >
                    {payment.status.toUpperCase()}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No payments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ marginLeft: '240px', padding: '24px', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
            Payment Management
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
          >
            <Tab 
              label={`Successful Payments (${successfulPayments.length})`}
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={`Cancelled Payments (${cancelledPayments.length})`}
              sx={{ fontWeight: 'bold' }}
            />
          </Tabs>

          {tabValue === 0 && renderPaymentTable(successfulPayments)}
          {tabValue === 1 && renderPaymentTable(cancelledPayments)}
        </Paper>
      </Container>
    </Box>
  );
};

export default Payments; 