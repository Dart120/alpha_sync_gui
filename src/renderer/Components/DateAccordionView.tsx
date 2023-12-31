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
    const refreshStartedListener = window.electron.ipcRenderer.on('refresh-started', () => {
      setRefreshing(true);
    });
    const recievedImagesListener = window.electron.ipcRenderer.on('recieved-images', (arg) => {
      setRefreshWasSucessful(arg as boolean);
      setRefreshing(false);
    });

    return () => {
      window.electron.ipcRenderer.removeEventListener('refresh-started', refreshStartedListener);
      window.electron.ipcRenderer.removeEventListener('recieved-images', recievedImagesListener);
    };
  }, []);
  const viewChoice = (): React.JSX.Element => {
    if (!refreshing) {
      if (refreshWasSucessful) {
        return (<DateAccordion dateImagesRecord={dateImagesRecord} setImages={setImages} />);
      }
      return (<Instructions />);
    }
    return (<CircularProgress color="warning" sx={{ margin: '5em' }} />);
  };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {viewChoice()}
    </div>
  );
};

export default DateAccordionView;
