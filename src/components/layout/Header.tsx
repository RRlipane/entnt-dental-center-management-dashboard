import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  Divider,
  Badge
} from '@mui/material';
import {
  Logout,
  Notifications,
  Menu as MenuIcon,
  AccountCircle,
  AdminPanelSettings,
  MedicalServices
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  
  const notifications = [
    { id: 1, text: 'New appointment scheduled for tomorrow', read: false },
    { id: 2, text: 'Patient John Doe updated his profile', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          {onToggleSidebar && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onToggleSidebar}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box display="flex" alignItems="center" mr={3}>
            <MedicalServices sx={{ 
              color: theme.palette.primary.main, 
              fontSize: 32, 
              mr: 1 
            }} />
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ENTNT Dental
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <IconButton
            size="large"
            aria-label={`show ${unreadCount} new notifications`}
            color="inherit"
            onClick={handleNotificationsOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Notifications
            </Typography>
            <Divider />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  dense
                  sx={{ 
                    bgcolor: notification.read ? 'inherit' : 'action.selected',
                    maxWidth: 300,
                    whiteSpace: 'normal'
                  }}
                >
                  <Typography variant="body2">
                    {notification.text}
                  </Typography>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  No new notifications
                </Typography>
              </MenuItem>
            )}
          </Menu>

          <Button
            startIcon={<Avatar sx={{ width: 24, height: 24 }}>
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>}
            endIcon={user?.role === 'Admin' ? <AdminPanelSettings fontSize="small" /> : undefined}
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ textTransform: 'none', ml: 1 }}
          >
            <Box textAlign="left">
              <Typography variant="subtitle2" lineHeight={1}>
                {user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem dense disabled>
              <AccountCircle sx={{ mr: 1 }} />
              <Typography variant="body2">My Profile</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} dense>
              <Logout sx={{ mr: 1 }} />
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;