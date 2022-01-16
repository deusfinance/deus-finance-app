import React, { useState } from 'react'
import Image from 'next/image'

import LoaderGif from 'assets/images/fallback/loader.gif'
import NotFound from 'assets/images/fallback/not_found.png'

export default function ImageWithFallback ({ 
  src, 
  alt, 
  width, 
  height, 
  loading = false, 
  ...rest
}: {
  src: StaticImageData,
  alt: string,
  width: number,
  height: number,
  loading?: boolean,
  [x: string]: any
}) {
  const [imgSrc, setImgSrc] = useState<StaticImageData>(src)
  const getProps = () => {
    return {
      alt,
      width,
      height,
      onError: () => setImgSrc(NotFound),
      ...rest,
    }
  }

  return loading ? (
    <Image
      src={LoaderGif}
      {...getProps()}
    />
  ) : (
    <Image
      src={imgSrc || NotFound}
      unoptimized={false} // set to true if you're using blobs
      {...getProps()}
    />
  )
}
