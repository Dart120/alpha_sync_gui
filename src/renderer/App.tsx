import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import {
  useState, useEffect, createContext, useRef,
} from 'react';
import { UPNPImage, DisplayUPNPImage } from 'main/Types';
import DownloadManager from './DownloadManager';
import DateAccordionView from './Components/DateAccordionView';
import ResponsiveAppBar from './Components/Bar';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const downloadManager = new DownloadManager();
export const DownloadManagerContext = createContext<DownloadManager | null>(null);
export default function App() {
  console.log('Component rerendered');
  const [images, setImages] = useState({});
  // const [allChecked, setAllChecked] = useState(false);

  let displayDateImagesRecord: Record<string, DisplayUPNPImage[]> = {};
  useEffect(() => {
    console.log('rerender');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-images');
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
          }),
        );
        setImages(displayDateImagesRecord);
      } else {
        // Handle the case when `arg` is not the expected type.
        throw new Error('alpha_sync output not of expected type');
      }
    });
    return (() => {
      window.electron.ipcRenderer.removeEventListener('get-images');
      window.electron.ipcRenderer.removeEventListener('task-finished-class');
      console.log('destroyed');
      // window.electron.ipcRenderer.removeEventListener('recieved-images');
    });
  }, [downloadManager]);

  const downloadCheckedImages = (): void => {
    // window.electron.ipcRenderer.sendMessage();
    downloadManager.add({ message: 'download-checked-images', item: images });
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={(
            <DownloadManagerContext.Provider value={downloadManager}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <ResponsiveAppBar
                  downloadFunction={downloadCheckedImages}
                  setImages={setImages}
                />
                <DateAccordionView dateImagesRecord={images} setImages={setImages} />
              </div>
            </DownloadManagerContext.Provider>
          )}
        />
      </Routes>
    </Router>
  );
}
