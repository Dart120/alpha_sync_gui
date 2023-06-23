import { Channels } from './preload';

export interface UPNPImage {
  'upnp:class': 'object.item.imageItem.photo';
  'dc:title': string;
  '@_id': string;
  'dc:date'?: string;
  res: any[];
  ORG: string;
  LRG: string;
  TN: string;
  SM: string;
}

export interface DisplayUPNPImage extends UPNPImage {
  checked: boolean;
}

export interface Job {
  message: Channels;
  item:
    | UPNPImage
    | Record<string, DisplayUPNPImage[]>
    | Record<string, UPNPImage[]>;
}
