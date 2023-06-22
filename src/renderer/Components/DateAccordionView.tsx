import { FC } from 'react';
import { UPNPImage } from 'main/Types';
import { CircularProgress } from '@mui/material';
import DateAccordion from './DateAccordion';

import '../App.css';

type DateAccordionProps = {
  dateImagesRecord: Record<string, UPNPImage[]>;
};

const DateAccordionView: FC<DateAccordionProps> = ({ dateImagesRecord }) => {
  return (
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
        <DateAccordion dateImagesRecord={dateImagesRecord} />
      ) : (
        <CircularProgress sx={{ margin: '5em' }} />
      )}
    </div>
  );
};

export default DateAccordionView;
