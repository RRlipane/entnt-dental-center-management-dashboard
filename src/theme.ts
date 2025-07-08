import { createTheme } from '@mui/material/styles';

export const entntTheme = createTheme({
  palette: {
    mode: 'light',          // or 'dark'
    primary: {
      main : '#006AFF',
      light: '#3386FF',
      dark : '#0050CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00B495',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // gray‑50
    },
  },
  shape: {
    borderRadius: 8,
  },
});
