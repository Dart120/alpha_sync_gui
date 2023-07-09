import {
  ChangeEvent, FC, useState, Dispatch,
} from 'react';
import { ImageList } from '@mui/material';
import { DisplayUPNPImage } from 'main/Types';
import * as React from 'react';
import ImageView from './ImageView';

type ImagesViewProps = {
  images: DisplayUPNPImage[];
  setImages: (key:string, idx: number, val: boolean) => void
  date: string
  setIsChecked: Dispatch<React.SetStateAction<boolean>>
};

const ImagesView: FC<ImagesViewProps> = ({
  images, date, setImages, setIsChecked,
}) => {
  const checkIfAllTicked = () => {
    const res = images.reduce((isAllChecked, image) => (image.checked && isAllChecked), true);
    setIsChecked(res);
  };

  return (
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
  );
};

export default ImagesView;
