import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import { UPNPImage, DisplayUPNPImage } from 'main/Types';
import DownloadManager from './DownloadManager';
import DateAccordionView from './Components/DateAccordionView';
import ResponsiveAppBar from './Components/Bar';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const downloadManager: DownloadManager = new DownloadManager();
export const DownloadManagerContext = createContext(downloadManager);

export default function App() {
  const [images, setImages] = useState({});
  let displayDateImagesRecord: Record<string, DisplayUPNPImage[]> = {};
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-images');
  }, []);

  window.electron.ipcRenderer.once('recieved-images', (arg) => {
    // eslint-disable-next-line no-console
    if (typeof arg === 'object' && arg !== null) {
      const record = arg as Record<string, UPNPImage[]>;
      displayDateImagesRecord = Object.fromEntries(
        Object.entries(record).map(([key, value]) => {
          const newValue = value.map((image: UPNPImage): DisplayUPNPImage => {
            (image as DisplayUPNPImage).checked = false;
            return image as DisplayUPNPImage;
          });
          return [key, newValue];
        })
      );
      setImages(displayDateImagesRecord);
    } else {
      // Handle the case when `arg` is not the expected type.
      throw new Error('alpha_sync output not of expected type');
    }
  });

  const downloadCheckedImages = (): void => {
    // window.electron.ipcRenderer.sendMessage();
    downloadManager.add({ message: 'download-checked-images', item: images });
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DownloadManagerContext.Provider value={downloadManager}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <ResponsiveAppBar downloadFunction={downloadCheckedImages} />
                <DateAccordionView dateImagesRecord={images} />
              </div>
            </DownloadManagerContext.Provider>
          }
        />
      </Routes>
    </Router>
  );
}
