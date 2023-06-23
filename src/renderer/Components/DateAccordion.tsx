import { FC } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UPNPImage, DisplayUPNPImage } from 'main/Types';
import { CheckBox } from '@mui/icons-material';
import ImagesView from './ImagesView';

type DateAccordionProps = {
  dateImagesRecord: Record<string, DisplayUPNPImage[]>;
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
        <ImagesView images={value} />
      </AccordionDetails>
    </Accordion>
  ));

  return <div>{listItems}</div>;
};

export default DateAccordion;
