import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
  useTheme,
  styled
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PatientsIcon,
  CalendarToday as AppointmentsIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  ExpandLess,
  ExpandMore,
  MedicalServices,
  Settings as SettingsIcon
} from '@mui/icons-material';

const SidebarLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
  '&:hover:not(.active)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openAdminMenu, setOpenAdminMenu] = useState(true);
  const [openPatientMenu, setOpenPatientMenu] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Patients', icon: <PatientsIcon />, path: '/patients' },
    { text: 'Appointments', icon: <AppointmentsIcon />, path: '/appointments' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
  ];

  const patientMenuItems = [
    { text: 'My Profile', icon: <ProfileIcon />, path: '/my-profile' },
    { text: 'My Appointments', icon: <CalendarIcon />, path: '/my-appointments' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 2,
          gap: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <MedicalServices sx={{ 
          color: theme.palette.primary.main,
          fontSize: 32
        }} />
        <Typography variant="h6" noWrap>
          ENTNT Dental
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {user?.role === 'Admin' && (
          <>
            <ListItemButton onClick={() => setOpenAdminMenu(!openAdminMenu)}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" />
              {openAdminMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAdminMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {adminMenuItems.map((item) => (
                  <SidebarLink key={item.text} to={item.path}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </SidebarLink>
                ))}
              </List>
            </Collapse>
            <Divider />
          </>
        )}

        {user?.role === 'Patient' && (
          <>
            <ListItemButton onClick={() => setOpenPatientMenu(!openPatientMenu)}>
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Patient" />
              {openPatientMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPatientMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {patientMenuItems.map((item) => (
                  <SidebarLink key={item.text} to={item.path}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </SidebarLink>
                ))}
              </List>
            </Collapse>
            <Divider />
          </>
        )}

        <SidebarLink to="/settings">
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </SidebarLink>
      </Box>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;