/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect, useContext } from 'react';
import DownloadManager from 'renderer/DownloadManager';
import { CircularProgress, Stack, Button } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { DownloadManagerContext } from 'renderer/App';
import Toast from './Toast';

function DownloadManagerView() {
  const { jobQueue } = useContext<DownloadManager | null>(DownloadManagerContext);
  const [length, setLength] = useState(jobQueue.length);
  const [showFinishedToast, setShowFinishedToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  useEffect(() => {
    const taskFinishedListener = window.electron.ipcRenderer.on('task-finished', (success) => {
      console.log('DETECTED TASK FINISHED');
      if (success) {
        setShowFinishedToast(true);
        setLength((len:number) => Math.max(0, len - 1));
        console.log(jobQueue.length);
      } else {
        setShowFailureToast(true);
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
          spacing={2}
        >
          <Typography>Executing Job 1/{length}</Typography>
          <CircularProgress sx={{ margin: '1em' }} />
          <Button size="small" onClick={handleCancel} color="warning" variant="contained" startIcon={<ExitToApp />}>Cancel All</Button>
        </Stack>
      ) : (
        <p>Idle</p>
      )}
      <Toast severity="success" message="A download just finished" open={showFinishedToast} setOpen={setShowFinishedToast} />
      <Toast severity="error" message="A download just failed/was cancelled" open={showFailureToast} setOpen={setShowFailureToast} />
    </>
  );
}

export default DownloadManagerView;
