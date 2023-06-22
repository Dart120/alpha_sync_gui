import { FC, useState } from 'react';
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@mui/material';
import Download from '@mui/icons-material/Download';
import Skeleton from '@mui/material/Skeleton';
import { UPNPImage } from 'main/Types';

type ImageViewProps = {
  images: UPNPImage[];
};

const ImageView: FC<ImageViewProps> = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(
    new Set<string>()
  );

  const handleImageLoad = (src: string) => {
    setLoadedImages((prevLoadedImages) => prevLoadedImages.add(src));
  };

  return (
    <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={164}>
      {images.map((item) => (
        <ImageListItem key={item['dc:title']}>
          <img
            style={{ objectFit: 'contain', width: '100%', height: 164 }}
            src={item.SM}
            alt={loadedImages.has(item.SM) ? '' : item['dc:title']}
            loading="lazy"
            onLoad={() => handleImageLoad(item.SM)}
          />
          {!loadedImages.has(item.SM) && (
            <Skeleton variant="rectangular" width="100%" height={250} />
          )}
          <ImageListItemBar
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255)' }}
                aria-label="Download"
                onClick={() => {
                  window.electron.ipcRenderer.sendMessage(
                    'start-download',
                    item.ORG,
                    item['dc:title']
                  );
                }}
              >
                <Download />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ImageView;
