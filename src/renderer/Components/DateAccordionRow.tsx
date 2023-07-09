import { FC, useState, ChangeEvent } from 'react';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import { DisplayUPNPImage } from 'main/Types';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/material';
import ImagesView from './ImagesView';

type DateAccordionProps = {
  setImages: (key:string, idx: number, val: boolean) => void;
  images: DisplayUPNPImage[];
  date: string;
};
const DateAccordionRow: FC<DateAccordionProps> = ({ setImages, images, date }) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);

    images.forEach((val, idx) => {
      setImages(date, idx, event.target.checked);
    });
  };

  return (
    <Accordion key={date} sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography>{date}</Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography>Select All On This Date</Typography>
            <Checkbox
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => handleCheck(event)}
              checked={isChecked}
            />
          </Stack>

        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <ImagesView images={images} setImages={setImages} setIsChecked={setIsChecked} date={date} />
      </AccordionDetails>
    </Accordion>
  );
};

export default DateAccordionRow;
