import { ChangeEvent, FC, useState } from 'react';
import { ImageList, Typography } from '@mui/material';
import { DisplayUPNPImage } from 'main/Types';
import CheckBox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import ImageView from './ImageView';

type ImagesViewProps = {
  images: DisplayUPNPImage[];
};

const ImagesView: FC<ImagesViewProps> = ({ images }) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    images.forEach((image: DisplayUPNPImage) => {
      image.checked = event.target.checked;
    });
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
        <CheckBox onChange={(event) => handleCheck(event)} />
      </Stack>

      <ImageList sx={{ width: '100%', height: 450 }} cols={5} rowHeight={164}>
        {images.map((item) => (
          <ImageView
            key={item['dc:title']}
            item={item}
            globalChecked={isChecked}
          />
        ))}
      </ImageList>
    </>
  );
};

export default ImagesView;
