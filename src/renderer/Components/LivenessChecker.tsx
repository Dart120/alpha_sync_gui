import { useEffect, useState } from 'react';

function LivenessChecker() {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const recievedLivenessListener = window.electron.ipcRenderer.on('recieved-liveness', (arg) => {
      // eslint-disable-next-line no-console
      console.log(`recieved ${arg}`);
      setStatus(arg as boolean);
    });
    window.electron.ipcRenderer.sendMessage('get-liveness');
    console.log('sent');
    const int = setInterval(() => {
      window.electron.ipcRenderer.sendMessage('get-liveness');
      console.log('sent');
    }, 500);

    return () => {
      window.electron.ipcRenderer.removeEventListener('recieved-liveness', recievedLivenessListener);
      clearInterval(int);
    };
  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      style={{ margin: '1em' }}
    >
      <circle cx="10" cy="10" r="5" fill={status ? 'green' : 'red'} />
    </svg>
  );
}
export default LivenessChecker;
