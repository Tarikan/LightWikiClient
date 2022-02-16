import {ImageMetadata} from "./image-metadata";
import {parseJson} from "@angular/cli/utilities/json-file";

export interface Image {
  fileUrl: string;
  imageMetadata: string;
}

export function getImageMetadata(image: Image): ImageMetadata {
  return JSON.parse(image.imageMetadata);
}

export function getSrcSetFromImage(image: Image): string[] {
  const metadata = getImageMetadata(image);
  const minSize = metadata.availableSizes.sort()[0];

  const res: string[] = [];

  metadata.availableSizes.forEach(s => {
    res.push(`${image.fileUrl}-${s} ${s / minSize}x`);
  });

  return res;
}
