import * as React from 'react';
import { useEffect, useState } from 'react';

function LivenessChecker() {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const int = setInterval(() => {
      console.log('sent');
      window.electron.ipcRenderer.sendMessage('get-liveness');
    }, 5000);

    return () => {
      clearInterval(int);
    };
  }, []);
  window.electron.ipcRenderer.once('recieved-liveness', (arg) => {
    // eslint-disable-next-line no-console
    setStatus(arg as boolean);
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      style={{ marginLeft: 'auto' }}
    >
      <circle cx="10" cy="10" r="5" fill={status ? 'green' : 'red'} />
    </svg>
  );
}
export default LivenessChecker;
