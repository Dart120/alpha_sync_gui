/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect, useContext } from 'react';
import * as React from 'react';
import DownloadManager from 'renderer/DownloadManager';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DownloadManagerContext } from 'renderer/App';

function DownloadManagerView() {
  const downloadManager = useContext<DownloadManager | null>(DownloadManagerContext);
  const [jobs, setJobs] = useState(0);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.on('task-finished', () => {
      setTrigger((t) => !t);
    });
    return () => {
      window.electron.ipcRenderer.removeEventListener('task-finished');
    };
  }, []);

  useEffect(() => {
    console.log('useeffect fired on length change');
    if (downloadManager) {
      setJobs(downloadManager.jobQueue.length);
    } else {
      setJobs(0);
    }
  }, []);

  return (
    <>
      {jobs ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography>Executing Job 1/{jobs}</Typography>
          <CircularProgress sx={{ margin: '1em' }} />
        </Stack>
      ) : (
        <p>here</p>
      )}
    </>
  );
}

export default DownloadManagerView;
