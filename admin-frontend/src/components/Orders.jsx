import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  styled,
} from '@mui/material';
import axios from 'axios';

// Styled components for animations
const AnimatedTableContainer = styled(TableContainer)`
  transition: all 0.3s ease-in-out;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 20px;
  .MuiTabs-indicator {
    height: 3px;
    background: linear-gradient(45deg, #2193b0, #6dd5ed);
  }
`;

const StyledTab = styled(Tab)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: #2193b0;
  }
  &.Mui-selected {
    color: #2193b0;
    font-weight: bold;
  }
`;

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(33, 147, 176, 0.1);
    transform: scale(1.01);
  }
`;

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState({ accepted: [], cancelled: [] });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('YOUR_API_ENDPOINT/orders');
        setOrders({
          accepted: response.data.filter(order => order.status === 'accepted'),
          cancelled: response.data.filter(order => order.status === 'cancelled'),
        });
        // Add small delay for animation
        setTimeout(() => setIsVisible(true), 100);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setIsVisible(false);
    setTimeout(() => {
      setTab(newValue);
      setIsVisible(true);
    }, 300);
  };

  return (
    <Box
      sx={{
        marginLeft: '240px', // Width of the sidebar
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper 
            elevation={3}
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              background: 'white',
              p: 3,
            }}
          >
            <StyledTabs 
              value={tab} 
              onChange={handleTabChange}
              centered
              sx={{ mb: 3 }}
            >
              <StyledTab label="Accepted Orders" />
              <StyledTab label="Cancelled Orders" />
            </StyledTabs>

            <AnimatedTableContainer
              className={isVisible ? 'visible' : ''}
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(33, 147, 176, 0.3)',
                  borderRadius: '4px',
                },
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        background: '#f5f5f5',
                        fontSize: '1rem',
                      }}
                    >
                      Order ID
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        background: '#f5f5f5',
                        fontSize: '1rem',
                      }}
                    >
                      Customer
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        background: '#f5f5f5',
                        fontSize: '1rem',
                      }}
                    >
                      Product
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        background: '#f5f5f5',
                        fontSize: '1rem',
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        background: '#f5f5f5',
                        fontSize: '1rem',
                      }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tab === 0 ? orders.accepted : orders.cancelled).map((order) => (
                    <StyledTableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>₹{order.amount}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </AnimatedTableContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Orders;