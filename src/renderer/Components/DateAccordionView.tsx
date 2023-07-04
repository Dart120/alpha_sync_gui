import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { DisplayUPNPImage } from 'main/Types';
import { CircularProgress } from '@mui/material';
import DateAccordion from './DateAccordion';

import '../App.css';
import Instructions from './Instructions';

type DateAccordionProps = {
  dateImagesRecord: Record<string, DisplayUPNPImage[]>;
  setImages: React.Dispatch<React.SetStateAction<object>>;
};

const DateAccordionView: FC<DateAccordionProps> = ({ dateImagesRecord, setImages }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshWasSucessful, setRefreshWasSucessful] = useState(false);
  useEffect(() => {
    window.electron.ipcRenderer.on('refresh-started', () => {
      setRefreshing(true);
    });
    window.electron.ipcRenderer.on('recieved-images', (arg) => {
      setRefreshWasSucessful(arg as boolean);
      setRefreshing(false);
    });

    return () => {
      window.electron.ipcRenderer.removeEventListener('refresh-started');
      window.electron.ipcRenderer.removeEventListener('recieved-images');
    };
  }, []);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'scroll',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {(!refreshing) ? (

        (refreshWasSucessful) ?
        (<DateAccordion dateImagesRecord={dateImagesRecord} setImages={setImages} />) : (<Instructions />)
      ) : (
        <CircularProgress sx={{ margin: '5em' }} />
      )}
    </div>
  );
};

export default DateAccordionView;
