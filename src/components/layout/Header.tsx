import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Menu  as MenuIcon,
  Logout,
  Notifications,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onToggleSidebar?: () => void;
}

const Header: React.FC<Props> = ({ onToggleSidebar }) => {
  const theme              = useTheme();
  const { user, logout }   = useAuth();
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        color  : theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* left block ---------------------------------------------------- */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* visible only on < md -------------------------------------- */}
          {onToggleSidebar && (
            <IconButton
              sx={{ mr: 1, display: { md: 'none' } }}
              onClick={onToggleSidebar}
              edge="start"
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" fontWeight={700}>
            ENTNT&nbsp;Dental
          </Typography>
        </Box>

        {/* right block --------------------------------------------------- */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={e => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={2} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* fake notifications pop‑up */}
          <Menu
            open={Boolean(notifAnchor)}
            anchorEl={notifAnchor}
            onClose={() => setNotifAnchor(null)}
          >
            <MenuItem dense>New appointment scheduled</MenuItem>
            <MenuItem dense>Patient profile updated</MenuItem>
          </Menu>

          <IconButton
            onClick={e => setAnchor(e.currentTarget)}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={() => setAnchor(null)}
          >
            <MenuItem disabled dense>
              {user?.role === 'Admin' && (
                <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} />
              )}
              {user?.email}
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={logout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
