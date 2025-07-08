import React, { useState, Fragment } from 'react';
import { Outlet }      from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { styled }      from '@mui/material/styles';

import Sidebar from './Sidebar';
import Header  from './Header';

const DRAWER_WIDTH = 240;

/* --- a small helper so content slides under / beside the Drawer ---------- */
const Main = styled('main', {
  shouldForwardProp: prop => prop !== 'shift',
})<{ shift?: boolean }>(({ theme, shift }) => ({
  flexGrow : 1,
  padding  : theme.spacing(2),
  paddingTop: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`,
  transition: theme.transitions.create('margin', {
    easing : theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(shift && {
    marginLeft: DRAWER_WIDTH,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  }),
}));

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  /* toggles only the *temporary* drawer */
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Fragment>
      <CssBaseline />

      {/* top bar  --------------------------------------------------------- */}
      <Header onToggleSidebar={handleDrawerToggle} />

      {/* drawers  --------------------------------------------------------- */}
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
      />

      {/* content  --------------------------------------------------------- */}
      <Main shift /* tells Main when the permanent drawer is visible */>
        <Outlet />
      </Main>
    </Fragment>
  );
};

export default Layout;
