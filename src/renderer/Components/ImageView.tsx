import {
  ChangeEvent, FC, useState, useEffect, useContext,
} from 'react';
import * as React from 'react';
import { ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import Download from '@mui/icons-material/Download';
import Skeleton from '@mui/material/Skeleton';
import Checkbox from '@mui/material/Checkbox';
import { DisplayUPNPImage } from 'main/Types';
import { DownloadManagerContext } from 'renderer/App';

type ImageViewProps = {
  item: DisplayUPNPImage;
  idx:number;
  setImages: (key:string, idx: number, val: boolean) => void;
  checkIfAllTicked: () => void;
  date:string;
};

const ImageView: FC<ImageViewProps> = ({
  item, date, setImages, idx, checkIfAllTicked,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const downloadManager = useContext(DownloadManagerContext);
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setImages(date, idx, event.target.checked);
    setIsChecked(event.target.checked);
  };
  useEffect(() => {
    setIsChecked(item.checked);
    checkIfAllTicked();
  }, [item.checked]);
  return (
    <ImageListItem key={item['dc:title']}>
      <img
        style={{ objectFit: 'contain', width: '100%', height: 164 }}
        src={item.TN}
        alt={isLoaded ? '' : item['dc:title']}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <Skeleton variant="rectangular" width="100%" height={250} />
      )}
      <ImageListItemBar
        actionIcon={(
          <IconButton
            sx={{ color: 'rgba(255, 255, 255)' }}
            aria-label="Download"
            onClick={() => {
              downloadManager.add({ message: 'start-download', item });
            }}
          >
            <Download />
          </IconButton>
        )}
      />
      <ImageListItemBar
        sx={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, '
            + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        }}
        title={item['dc:title']}
        position="top"
        actionIcon={(
          <IconButton
            sx={{ color: 'purple' }}
            aria-label={`checkbox ${item['dc:title']}`}
          >
            <Checkbox
              checked={isChecked}
              onChange={(event) => handleCheck(event)}
            />
          </IconButton>
        )}
        actionPosition="left"
      />
    </ImageListItem>
  );
};

export default ImageView;
