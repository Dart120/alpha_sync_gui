import { FC } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UPNPImage } from 'main/Types';
import ImageView from './ImageView';

type DateAccordionProps = {
  dateImagesRecord: Record<string, UPNPImage[]>;
};

const DateAccordion: FC<DateAccordionProps> = ({ dateImagesRecord }) => {
  const listItems = Object.entries(dateImagesRecord).map(([key, value]) => (
    <Accordion key={key} sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{key}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ImageView images={value} />
      </AccordionDetails>
    </Accordion>
  ));

  return <div>{listItems}</div>;
};

export default DateAccordion;
