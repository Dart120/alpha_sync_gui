import { FC, useState } from 'react';
import { ImageList, ImageListItem } from '@mui/material';
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
          {loadedImages.has(item.SM) ? (
            <img
              style={{ objectFit: 'contain', width: '100%', height: 164 }}
              src={item.SM}
              alt={loadedImages.has(item.SM) ? '' : item['dc:title']}
              loading="lazy"
              onLoad={() => handleImageLoad(item.SM)}
            />
          ) : (
            <Skeleton variant="rectangular" width="100%" height={164} />
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ImageView;
