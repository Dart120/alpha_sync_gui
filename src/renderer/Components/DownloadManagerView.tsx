/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect, useContext } from 'react';
import DownloadManager from 'renderer/DownloadManager';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DownloadManagerContext } from 'renderer/App';
import Toast from './Toast';

function DownloadManagerView() {
  const { jobQueue } = useContext<DownloadManager | null>(DownloadManagerContext);
  const [length, setLength] = useState(jobQueue.length);
  const [showFinishedToast, setShowFinishedToast] = useState(false);
  const [showFailureToast, setShowFailureToast] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.on('task-finished', (success) => {
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
    window.electron.ipcRenderer.on('length-likely-changed', () => {
      console.log('DETECTED Length changed');
      setLength(jobQueue.length);
      console.log(jobQueue.length);
    });

    return () => {
      window.electron.ipcRenderer.removeEventListener('task-finished');
      window.electron.ipcRenderer.removeEventListener('length-likely-changed');
    };
  }, []);

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
        </Stack>
      ) : (
        <p>Idle</p>
      )}
      <Toast severity="success" message="A download just finished" open={showFinishedToast} setOpen={setShowFinishedToast} />
      <Toast severity="error" message="A download just failed" open={showFailureToast} setOpen={setShowFailureToast} />
    </>
  );
}

export default DownloadManagerView;
