import { FC } from 'react';
import * as React from 'react';
import { UPNPImage, DisplayUPNPImage } from 'main/Types';
import { CircularProgress } from '@mui/material';
import DateAccordion from './DateAccordion';

import '../App.css';

type DateAccordionProps = {
  dateImagesRecord: Record<string, DisplayUPNPImage[]>;
  setImages: React.Dispatch<React.SetStateAction<{}>>;
};

const DateAccordionView: FC<DateAccordionProps> = ({ dateImagesRecord, setImages }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      overflow: 'scroll',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    {Object.keys(dateImagesRecord).length ? (
      <DateAccordion dateImagesRecord={dateImagesRecord} setImages={setImages} />
    ) : (
      <CircularProgress sx={{ margin: '5em' }} />
    )}
  </div>
);

export default DateAccordionView;
