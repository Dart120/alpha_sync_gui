import { FC, useState, ChangeEvent } from 'react';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import { DisplayUPNPImage } from 'main/Types';
import DateAccordionRow from './DateAccordionRow';

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

  const listItems = Object.entries(dateImagesRecord).map(([key, value]) => (
    <DateAccordionRow setImages={setImagesFull} images={value} date={key} />

  ));

  return <div>{listItems}</div>;
};

export default DateAccordion;
