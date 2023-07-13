import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  useState, useEffect, createContext,
} from 'react';
import { UPNPImage, DisplayUPNPImage } from 'main/Types';
import { SnackbarProvider, useSnackbar } from 'notistack';
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
  const { enqueueSnackbar } = useSnackbar();
  // const [allChecked, setAllChecked] = useState(false);

  let displayDateImagesRecord: Record<string, DisplayUPNPImage[]> = {};
  // useEffect(() => {
  //   console.log('rerender');
  //   console.log(images);
  // }, []);

  useEffect(() => {
    // window.electron.ipcRenderer.sendMessage('get-images');
    const recievedImagesListener = window.electron.ipcRenderer.on('recieved-images', (arg) => {
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
          enqueueSnackbar('Refreshed', { variant: 'success' });
        } else {
        // Handle the case when `arg` is not the expected type.
          console.log('fail should show');
          enqueueSnackbar('Refresh Failed (are you connected)', { variant: 'warning' });
        }
      } else {
        console.log('fail should show');
        enqueueSnackbar('Refresh Failed (are you connected)', { variant: 'warning' });
      }
    });
    return (() => {
      window.electron.ipcRenderer.removeEventListener('recieved-images', recievedImagesListener);
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
              </div>
            </DownloadManagerContext.Provider>
          )}
        />
      </Routes>
    </Router>
  );
}
