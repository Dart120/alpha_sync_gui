import {
  ChangeEvent, FC, useState, useEffect,
} from 'react';
import { ImageList, Typography } from '@mui/material';
import { DisplayUPNPImage } from 'main/Types';
import CheckBox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import ImageView from './ImageView';

type ImagesViewProps = {
  images: DisplayUPNPImage[];
  setImages: (key:string, idx: number, val: boolean) => void
  date: string
};

const ImagesView: FC<ImagesViewProps> = ({ images, date, setImages }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    images.forEach((val, idx) => {
      setImages(date, idx, event.target.checked);
    });
  };
  const checkIfAllTicked = () => {
    const res = images.reduce((tempIsAllChecked, image) => (image.checked && tempIsAllChecked), true);
    console.log(res);
    setIsChecked(res);
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography>Select All</Typography>
        <CheckBox onChange={(event) => handleCheck(event)} checked={isChecked} />
      </Stack>

      <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={164}>
        {images.map((item, idx) => (
          <ImageView
            key={item['dc:title']}
            date={date}
            idx={idx}
            item={item}
            setImages={setImages}
            checkIfAllTicked={checkIfAllTicked}
          />
        ))}
      </ImageList>
    </>
  );
};

export default ImagesView;
