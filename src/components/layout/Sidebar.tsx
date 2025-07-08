import React, { Fragment, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Toolbar,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PatientsIcon,
  CalendarToday as AppointmentsIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';

interface Props {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<Props> = ({ mobileOpen, onCloseMobile, drawerWidth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openAdmin, setOpenAdmin] = useState(true);
  const [openPatient, setOpenPatient] = useState(true);

  const adminLinks = [
    { text: 'Dashboard', icon: <DashboardIcon />, to: '/' },
    { text: 'Patients', icon: <PatientsIcon />, to: '/patients' },
    { text: 'Appointments', icon: <AppointmentsIcon />, to: '/appointments' },
    { text: 'Calendar', icon: <CalendarIcon />, to: '/calendar' },
  ];

  const patientLinks = [
    { text: 'My Profile', icon: <ProfileIcon />, to: '/my-profile' },
    { text: 'My Appointments', icon: <CalendarIcon />, to: '/my-appointments' },
  ];

  const renderLinks = (items: typeof adminLinks) =>
    items.map(({ text, icon, to }) => (
      <NavLink
        key={text}
        to={to}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {({ isActive }) => (
          <ListItemButton
            sx={{ pl: 4 }}
            selected={isActive}
            onClick={onCloseMobile}
          >
            <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        )}
      </NavLink>
    ));

  const DrawerContent = (
    <Fragment>
      <Toolbar />
      <Divider />
      <List disablePadding sx={{ pt: 0 }}>
        {user?.role === 'Admin' && (
          <>
            <ListItemButton onClick={() => setOpenAdmin(!openAdmin)}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Admin" />
              {openAdmin ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAdmin} timeout="auto" unmountOnExit>
              {renderLinks(adminLinks)}
            </Collapse>
            <Divider />
          </>
        )}

        {user?.role === 'Patient' && (
          <>
            <ListItemButton onClick={() => setOpenPatient(!openPatient)}>
              <ListItemIcon><ProfileIcon /></ListItemIcon>
              <ListItemText primary="Patient" />
              {openPatient ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openPatient} timeout="auto" unmountOnExit>
              {renderLinks(patientLinks)}
            </Collapse>
            <Divider />
          </>
        )}

        <NavLink to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <ListItemButton selected={isActive} sx={{ pl: 4 }}>
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          )}
        </NavLink>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <ListItemButton
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
        <ListItemText primary="Logout" primaryTypographyProps={{ color: 'error' }} />
      </ListItemButton>
    </Fragment>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {DrawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
