import * as React from 'react';

import AppBar from '@mui/material/AppBar';

import Typography from '@mui/material/Typography';

import Container from '@mui/material/Container';
import LivenessChecker from './LivenessChecker';

function ResponsiveAppBar() {
  return (
    <AppBar
      position="static"
      sx={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        marginBottom: '1em',
      }}
    >
      <Container
        sx={{
          width: '100%',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            marginTop: '1em',
            marginBottom: '1em',
            display: 'block',
            fontFamily: 'monospace',
            color: 'inherit',
            textDecoration: 'none',
            alignItems: 'center',
          }}
        >
          Alpha Sync
        </Typography>
        <LivenessChecker />
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;