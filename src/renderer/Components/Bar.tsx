import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { IconButton, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import Download from '@mui/icons-material/Download';
import DownloadManagerView from './DownloadManagerView';
import LivenessChecker from './LivenessChecker';

type ResponsiveAppBarProps = {
  downloadFunction: () => void; // Define the type of the prop
};
function ResponsiveAppBar({ downloadFunction }: ResponsiveAppBarProps) {
  return (
    <AppBar
      position="fixed"
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
          justifyContent: 'space-between',
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
        <Stack direction='row' alignItems='center' width='30%' justifyContent='space-between'>
        <IconButton
          sx={{ color: 'rgba(255, 255, 255)' }}
          aria-label="Download Checked"
          onClick={downloadFunction}
        >
          <Download sx={{ marginLeft: 'auto' }} />
        </IconButton>
        <LivenessChecker />
        <DownloadManagerView />
        </Stack>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
