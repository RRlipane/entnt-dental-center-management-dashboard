import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Link,
  FormControlLabel,
  Checkbox,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DentalLogo from '../../assets/dental-logo.svg';
import { UserRole } from '../../types/types';

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getEnv = () =>
  (typeof process !== 'undefined' ? process.env?.NODE_ENV : undefined) ??
 
  ((import.meta as any).env?.MODE as string | undefined);


interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState<{
    email?: string;
    password?: string;
  }>({});

  
  const redirectUser = useCallback(
    (role: UserRole) => {
      const map: Record<UserRole, string> = {
        Patient: '/my-profile',
        Admin: '/admin/dashboard',
        Doctor: '/doctor/dashboard',
      };
      navigate(map[role], { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    if (user) redirectUser(user.role);
  }, [user, redirectUser]);

  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldError(prev => ({ ...prev, [name]: undefined }));
    setError('');
  };

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(formData.email.trim()))
      errs.email = 'Please enter a valid email';

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';

    setFieldError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const ok = await login(
        formData.email.trim(),
        formData.password,
      );
      if (!ok) setError('Invalid email or password');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

 
  const fillDemo = (role: 'Admin' | 'Patient') => {
    const creds = {
      Admin: { email: 'admin@entnt.in', password: 'admin123' },
      Patient: { email: 'john@entnt.in', password: 'patient123' },
    }[role];
    setFormData({ ...creds, rememberMe: false });
    setError('');
    setFieldError({});
  };

  const isDev = getEnv() === 'development';

  
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg,#f5f7fa 0%,#e4f0f9 100%)'
            : 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 450,
          borderRadius: 2,
          position: 'relative',
        }}
      >
        
        <Box textAlign="center" mb={3}>
          <img
            src={DentalLogo}
            alt="ENTNT Dental Center"
            style={{ height: 60, marginBottom: 16 }}
          />
          <Typography variant="h5" fontWeight={600}>
            Dental Center Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Sign in to access your account
          </Typography>
        </Box>

       
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
            autoComplete="email"
            autoFocus
            error={!!fieldError.email}
            helperText={fieldError.email}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            fullWidth
            required
            autoComplete="current-password"
            error={!!fieldError.password}
            helperText={fieldError.password}
            sx={{ mb: 1 }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Remember me"
            />

            <Link
              href="#"
              variant="body2"
              underline="hover"
              onClick={e => {
                e.preventDefault();
                
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Box>

        
        {isDev && (
          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary" mb={1}>
              Demo credentials
            </Typography>
            <Box display="flex" gap={1} justifyContent="center">
              <Button
                size="small"
                variant="outlined"
                onClick={() => fillDemo('Admin')}
              >
                Admin
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => fillDemo('Patient')}
              >
                Patient
              </Button>
            </Box>
          </Box>
        )}

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ENTNT Dental Center
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
