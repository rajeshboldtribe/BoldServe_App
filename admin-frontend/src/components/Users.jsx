import { useEffect, useState } from 'react';
import {
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
  CircularProgress,
  Typography
} from '@mui/material';
import { userAPI } from '../utils/axios';

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

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(33, 147, 176, 0.1);
    transform: scale(1.01);
  }
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userAPI.getAllUsers();
        console.log('Users data received:', data);
        
        // Handle the users array directly from the response
        const userData = Array.isArray(data) ? data : data.users || [];
        
        setUsers(userData);
        setTimeout(() => setIsVisible(true), 100);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUserDisplayName = (user) => {
    // Try different possible name fields in order of preference
    return user.customerName || // if customerName exists
           user.fullName ||     // or fullName
           user.name ||         // or name
           user.username ||     // or username
           'N/A';              // default if none exist
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        marginLeft: '240px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        marginLeft: '240px'
      }}>
        <Typography color="error">
          {error}
          <br />
          <small>Please check if the backend server is running on port 8003</small>
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginLeft: '240px',
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
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              User Management
            </Typography>
            
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
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', fontSize: '1rem' }}>
                      Sl No
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', fontSize: '1rem' }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', fontSize: '1rem' }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', fontSize: '1rem' }}>
                      Contact Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5', fontSize: '1rem' }}>
                      Email ID
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <StyledTableRow 
                        key={user._id || index}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user._id}</TableCell>
                        <TableCell>{getUserDisplayName(user)}</TableCell>
                        <TableCell>{user.contactNumber || user.phone || user.mobile || 'N/A'}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AnimatedTableContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Users;