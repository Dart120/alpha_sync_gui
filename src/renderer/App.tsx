import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  useState, useEffect, createContext,
} from 'react';
import { UPNPImage, DisplayUPNPImage } from 'main/Types';
import DownloadManager from './DownloadManager';
import DateAccordionView from './Components/DateAccordionView';
import ResponsiveAppBar from './Components/Bar';
import Toast from './Components/Toast';
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
  const [showRefreshSuccess, setShowRefreshSuccess] = useState(false);
  const [showRefreshFail, setShowRefreshFail] = useState(false);
  // const [allChecked, setAllChecked] = useState(false);

  let displayDateImagesRecord: Record<string, DisplayUPNPImage[]> = {};
  // useEffect(() => {
  //   console.log('rerender');
  //   console.log(images);
  // }, []);

  useEffect(() => {
    // window.electron.ipcRenderer.sendMessage('get-images');
    window.electron.ipcRenderer.on('recieved-images', (arg) => {
      // eslint-disable-next-line no-console
      if (arg) {
        if (typeof arg === 'object' && arg !== null) {
          const record = arg as Record<string, UPNPImage[]>;
          displayDateImagesRecord = Object.fromEntries(
            Object.entries(record).map(([key, value]) => {
              const newValue = value.map((image: UPNPImage): DisplayUPNPImage => {
              // eslint-disable-next-line no-param-reassign
                (image as DisplayUPNPImage).checked = false;
                return image as DisplayUPNPImage;
              });
              return [key, newValue];
            }),
          );
          setImages(displayDateImagesRecord);
          setShowRefreshSuccess(true);
        } else {
        // Handle the case when `arg` is not the expected type.
          setShowRefreshFail(true);
        }
      } else {
        setShowRefreshFail(true);
      }
    });
    return (() => {
      window.electron.ipcRenderer.removeEventListener('get-images');
      window.electron.ipcRenderer.removeEventListener('recieved-images');
      window.electron.ipcRenderer.removeEventListener('task-finished-class');
      // window.electron.ipcRenderer.removeEventListener('recieved-images');
    });
  }, [downloadManager]);

  const downloadCheckedImages = (): void => {
    // window.electron.ipcRenderer.sendMessage();
    downloadManager.add({ message: 'download-checked-images', item: images });
  };
  const refreshFunction = (): void => {
    window.electron.ipcRenderer.sendMessage('get-images');
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
                  refreshFunction={refreshFunction}
                />
                <DateAccordionView dateImagesRecord={images} setImages={setImages} />
                <Toast severity="success" message="Refreshed" open={showRefreshSuccess} setOpen={setShowRefreshSuccess} />
                <Toast severity="error" message="Refresh Failed (are you connected)" open={showRefreshFail} setOpen={setShowRefreshFail} />
              </div>
            </DownloadManagerContext.Provider>
          )}
        />
      </Routes>
    </Router>
  );
}
