import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button';
import icon from '../../assets/icon.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Hello() {

  // calling IPC exposed from preload script
  window.electron.ipcRenderer.once('recieved-images', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
  });
  // window.electron.ipcRenderer.sendMessage('get-images');

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          console.log('clicked');
          window.electron.ipcRenderer.sendMessage('get-images');
        }}
      >
        Hello World
      </Button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
