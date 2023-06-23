/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { DownloadManagerContext } from 'renderer/App';

const DownloadManagerView = () => {
  const { jobQueue } = useContext(DownloadManagerContext);
  const [jobs, setJobs] = useState(0);
  const [trigger, setTrigger] = useState(false);
  window.electron.ipcRenderer.on('task-finished', () => {
    setTrigger((t) => !t);
  });
  window.electron.ipcRenderer.on('trigger', () => {
    setTrigger((t) => !t);
  });
  useEffect(() => {
    console.log('useeffect fired on length change');
    setJobs(jobQueue.length);
  }, [trigger, jobQueue.length]);

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
};

export default DownloadManagerView;
