import { FC } from 'react';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DisplayUPNPImage } from 'main/Types';
import ImagesView from './ImagesView';

type DateAccordionProps = {
  dateImagesRecord: Record<string, DisplayUPNPImage[]>;
  setImages: React.Dispatch<React.SetStateAction<object>>;
};

const DateAccordion: FC<DateAccordionProps> = ({ dateImagesRecord, setImages }) => {
  const setImagesFull = (key: string, idx: number, val: boolean) => {
    setImages((images: Record<string, DisplayUPNPImage[]>) => {
      // eslint-disable-next-line no-param-reassign
      images[key][idx].checked = val;
      return { ...images };
    });
  };

  const listItems = Object.entries(dateImagesRecord).map(([key, value]) => {
    console.log(key);
    return (
      <Accordion key={key} sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{key}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ImagesView images={value} setImages={setImagesFull} date={key} />
        </AccordionDetails>
      </Accordion>
    );
  });

  return <div>{listItems}</div>;
};

export default DateAccordion;
