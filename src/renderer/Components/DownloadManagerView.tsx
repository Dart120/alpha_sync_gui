/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect, useContext } from 'react';
import DownloadManager from 'renderer/DownloadManager';
import { CircularProgress, Stack, Button } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Typography from '@mui/material/Typography';
import { DownloadManagerContext } from 'renderer/App';

function DownloadManagerView() {
  const { jobQueue } = useContext<DownloadManager | null>(DownloadManagerContext);
  const { enqueueSnackbar } = useSnackbar();
  const [length, setLength] = useState(jobQueue.length);
  useEffect(() => {
    const taskFinishedListener = window.electron.ipcRenderer.on('task-finished', (success) => {
      console.log('DETECTED TASK FINISHED');
      if (success) {
        enqueueSnackbar('A download just finished', { variant: 'success' });
        setLength((len:number) => Math.max(0, len - 1));
        console.log(jobQueue.length);
      } else {
        enqueueSnackbar('A download just failed/was cancelled', { variant: 'warning' });
        setLength(0);
        console.log(jobQueue.length);
      }
    });
    const lengthLikelyChangedListener = window.electron.ipcRenderer.on('length-likely-changed', () => {
      console.log('DETECTED Length changed');
      setLength(jobQueue.length);
    });
    const cancelledListener = window.electron.ipcRenderer.on('cancelled', () => {
      setLength(0);
    });

    return () => {
      window.electron.ipcRenderer.removeEventListener('task-finished', taskFinishedListener);
      window.electron.ipcRenderer.removeEventListener('length-likely-changed', lengthLikelyChangedListener);
      window.electron.ipcRenderer.removeEventListener('cancelled', cancelledListener);
    };
  }, []);
  const handleCancel = () => {
    window.electron.ipcRenderer.sendMessage('cancel-all-jobs');
  };

  return (
    <>
      {length ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          // spacing={2}
        >
          <Typography>Executing Job 1/{length}</Typography>
          <CircularProgress sx={{ margin: '1em' }} color="warning"/>
          <Button size="small" onClick={handleCancel} color="warning" variant="contained" startIcon={<ExitToApp />}>Cancel All</Button>
        </Stack>
      ) : (
        <p>Idle</p>
      )}
    </>
  );
}

export default DownloadManagerView;
