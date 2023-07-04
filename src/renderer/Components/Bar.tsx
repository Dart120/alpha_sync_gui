import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import { Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DisplayUPNPImage } from 'main/Types';
import Checkbox from '@mui/material/Checkbox';
import DownloadManagerView from './DownloadManagerView';
import LivenessChecker from './LivenessChecker';

type ResponsiveAppBarProps = {
  downloadFunction: () => void; // Define the type of the prop
  refreshFunction: () => void; // Define the type of the prop
  setImages: React.Dispatch<React.SetStateAction<object>>;
};
function ResponsiveAppBar({ downloadFunction, setImages, refreshFunction }: ResponsiveAppBarProps) {
  const [checked, setChecked] = useState(false);
  const [refreshCanBeClicked, setRefreshCanBeClicked] = useState(true);
  const handleRefresh = () => {
    refreshFunction();
    setRefreshCanBeClicked(false);
    setTimeout(() => setRefreshCanBeClicked(true), 5000);
  };
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    console.log('handling check');
    setImages((images: Record<string, DisplayUPNPImage[]>) => Object.fromEntries(
      Object.entries(images).map(([key, value]) => {
        // eslint-disable-next-line no-param-reassign
        value.forEach((image) => { image.checked = event.target.checked; });
        return [key, value];
      }),
    ));
    console.log('handled');
  };
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
          justifyContent: 'space-evenly',
          display: 'flex',
          alignItems: 'center',
          minWidth: '20em',
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
            color: 'inherit',
            textDecoration: 'none',
            alignItems: 'center',
          }}
        >
          Alpha Sync
        </Typography>
        {/* <div style={{ display:'flex', flexDirection:'row', alignItems:'center' }}>

        </div> */}

        <Stack
          direction="row"
          alignItems="center"
        >
          <Typography> Select all</Typography>
          <Checkbox
            onChange={(event) => handleCheck(event)}
            checked={checked}
            color="success"
          />
        </Stack>
        <Button size="small" onClick={downloadFunction} color="success" variant="contained" startIcon={<DownloadIcon />}>Download</Button>
        <Button disabled={!refreshCanBeClicked} size="small" onClick={handleRefresh} color="success" variant="contained" startIcon={<RefreshIcon />}>Refresh/Reconnect</Button>
        <Stack
          direction="row"
          alignItems="center"
        >
          <Typography>Connected:</Typography>
          <LivenessChecker />
        </Stack>
        <DownloadManagerView />

      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
