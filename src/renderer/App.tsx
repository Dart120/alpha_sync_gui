import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UPNPImage } from 'main/Types';
import DateAccordionView from './Components/DateAccordionView';
import ResponsiveAppBar from './Components/Bar';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function App() {
  const [images, setImages] = useState({});
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-images');
  }, []);
  window.electron.ipcRenderer.once('recieved-images', (arg) => {
    // eslint-disable-next-line no-console
    if (typeof arg === 'object' && arg !== null) {
      const record = arg as Record<string, UPNPImage[]>;
      setImages(record);
      // Now you can use `record` as `Record<string, UPNPImage[]>`
    } else {
      // Handle the case when `arg` is not the expected type.
      throw new Error('alpha_sync output not of expected type');
    }
  });
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <ResponsiveAppBar />
              <DateAccordionView dateImagesRecord={images} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
