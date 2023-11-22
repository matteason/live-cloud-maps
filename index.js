const Jimp = require('jimp');
const fs = require('fs');
const https = require('https');

console.log(`Generating cloud maps...`);

const SOURCE_WIDTH = 8192;
const SOURCE_HEIGHT = SOURCE_WIDTH/2;

const OUTPUT_DIR = './out/images';
const TEMP_DIR = './tmp';

const monthNumber = (new Date()).getMonth() + 1

// Bump up Jimp memory limit
const cachedJpegDecoder = Jimp.decoders['image/jpeg']
Jimp.decoders['image/jpeg'] = (data) => {
  const userOpts = { maxMemoryUsageInMB: 1024 }
  return cachedJpegDecoder(data, userOpts)
}

const imagesToLoad = [
  {
    type: 'IR_MAP_LEFT',
    path: `https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:worldcloudmap_ir108&styles=&format=image/png&crs=EPSG:4326&bbox=-90,-180,90,0&width=${SOURCE_HEIGHT}&height=${SOURCE_HEIGHT}`,
    loaded: false,
    imageData: null
  },
  {
    type: 'IR_MAP_RIGHT',
    path: `https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:worldcloudmap_ir108&styles=&format=image/png&crs=EPSG:4326&bbox=-90,0,90,180&width=${SOURCE_HEIGHT}&height=${SOURCE_HEIGHT}`,
    loaded: false,
    imageData: null
  },
  {
    type: 'DUST_MAP_LEFT',
    path: `https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_dust&styles=&format=image/png&crs=EPSG:4326&bbox=-90,-180,90,0&width=${SOURCE_HEIGHT}&height=${SOURCE_HEIGHT}`,
    loaded: false,
    imageData: null
  },
  {
    type: 'DUST_MAP_RIGHT',
    path: `https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_dust&styles=&format=image/png&crs=EPSG:4326&bbox=-90,0,90,180&width=${SOURCE_HEIGHT}&height=${SOURCE_HEIGHT}`,
    loaded: false,
    imageData: null
  },
  {
    type: 'VISIBLE_MAP_LEFT',
    path: `https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&styles=&format=image/png&crs=EPSG:4326&bbox=-90,-180,90,0&width=${SOURCE_HEIGHT}&height=${SOURCE_HEIGHT}`,
    loaded: false,
    imageData: null
  },
  {
    type: 'VISIBLE_MAP_RIGHT',
    path: `https://view.eumetsat.int/geoserver/ows?service=WMS&request=GetMap&version=1.3.0&layers=mumi:wideareacoverage_rgb_natural&styles=&format=image/png&crs=EPSG:4326&bbox=-90,0,90,180&width=${SOURCE_HEIGHT}&height=${SOURCE_HEIGHT}`,
    loaded: false,
    imageData: null
  },
  {
    type: 'FRAME',
    path: 'static_images/frame.png',
    loaded: false,
    imageData: null
  },
  {
    type: 'EARTH_WITHOUT_CLOUDS',
    path: `static_images/monthly/earth/${monthNumber}.jpg`,
    loaded: false,
    imageData: null
  },
  {
    type: 'EARTH_WITHOUT_CLOUDS_NIGHT',
    path: `static_images/monthly/earth-night/${monthNumber}.jpg`,
    loaded: false,
    imageData: null
  },
  {
    type: 'SPECULAR_BASE',
    path: `static_images/monthly/specular-base/${monthNumber}.jpg`,
    loaded: false,
    imageData: null
  }
];

imagesToLoad.forEach((img) => loadImage(img));

function loadImage(img) {
  console.log(`Loading ${img.type} from '${img.path}'...`)

  if(img.path.startsWith('https://')) {
    // Download image from URL
    https.get(img.path,(res) => {
      console.log(`Downloaded ${img.type} from '${img.path}'`);

      if (!fs.existsSync(TEMP_DIR)){
        fs.mkdirSync(TEMP_DIR, { recursive: true });
      }

      const path = `${TEMP_DIR}/${img.type}.png`;
      const filePath = fs.createWriteStream(path);

      res.pipe(filePath);
      filePath.on('finish',() => {
        filePath.close();

        // Read image to memory
        Jimp.read(path)
          .then(imgData => {
            img.imageData = imgData;
            img.loaded = true;
            checkIfAllLoaded(img);
          })
          .catch(err => {
            console.error(err);
          });
      })
    })
  } else {
    // Read image from disk
    Jimp.read(img.path)
      .then(imgData => {
        img.imageData = imgData;
        img.loaded = true;
        checkIfAllLoaded(img);
      })
      .catch(err => {
        console.error(err);
      });
  }
}

function imageDataForType(type) {
  return imagesToLoad.find(i => i.type === type).imageData;
}

function checkIfAllLoaded(img) {
  console.log(`Finished loading ${img.type} from '${img.path}'`)
  // Return if there are any images which haven't loaded
  if(imagesToLoad.findIndex(i => !i.loaded) !== -1) {
    return;
  }

  console.log('All images loaded');
  processImages();
}

function interpolate(fromA, toA, fromB, toB, input) {
  if(input < fromA) {
    return fromB
  }

  if(input > toA) {
    return toB
  }

  const proportionOfRange = (input - fromA) / (toA - fromA);
  return fromB + (toB - fromB) * proportionOfRange;
}

function screen(A, B) {
  const ax = A/255.0
  const bx = B/255.0
  return (1 - (1 - ax) * (1 - bx)) * 255
}

function multiply(A, B) {
  const ax = A/255.0
  const bx = B/255.0
  return ax * bx * 255
}

function gamma(gamma, input) {
  const gammaCorrection = 1 / gamma

  // Gamma algorithm based on https://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-6-gamma-correction/
  return 255 * Math.pow(input / 255, gammaCorrection)
}

function processImages() {
  const irMapLeft = imageDataForType('IR_MAP_LEFT');
  const irMapRight = imageDataForType('IR_MAP_RIGHT');
  const dustMapLeft = imageDataForType('DUST_MAP_LEFT');
  const dustMapRight = imageDataForType('DUST_MAP_RIGHT');
  const visibleMapLeft = imageDataForType('VISIBLE_MAP_LEFT');
  const visibleMapRight = imageDataForType('VISIBLE_MAP_RIGHT');
  const frame = imageDataForType('FRAME');
  const earthWithoutClouds = imageDataForType('EARTH_WITHOUT_CLOUDS');
  const earthWithoutCloudsNight = imageDataForType('EARTH_WITHOUT_CLOUDS_NIGHT');
  const specularBase = imageDataForType('SPECULAR_BASE');

  console.log('Creating cloud map');

  // When we combine these images, we do them the wrong way round (left on the right, right on the left).
  // This is to make it easier to fix the gap at the antimeridian later on. We'll swap them back later.

  // Combine the left and right IR images
  const irMap = new Jimp(SOURCE_WIDTH, SOURCE_HEIGHT);
  irMap.blit(irMapRight, 0, 0).blit(irMapLeft, SOURCE_WIDTH/2, 0);

  // Combine the left and right dust images
  const dustMap = new Jimp(SOURCE_WIDTH, SOURCE_HEIGHT);
  dustMap.blit(dustMapRight, 0, 0).blit(dustMapLeft, SOURCE_WIDTH/2, 0);

  // Combine the left and right visible images
  const visibleMap = new Jimp(SOURCE_WIDTH, SOURCE_HEIGHT);
  visibleMap.blit(visibleMapRight, 0, 0).blit(visibleMapLeft, SOURCE_WIDTH/2, 0);

  // Create a blank canvas for our cloud map
  const cloudMap = new Jimp(SOURCE_WIDTH, SOURCE_HEIGHT, 0xff0000ff);

  let gapStartX = null;
  let gapEndX = null;
  let gapStartVal = null;
  let gapEndVal = null;
  let afterGapCounter = 0;

  cloudMap.scan(0, 0, cloudMap.bitmap.width, cloudMap.bitmap.height, function(x, y, idx) {
    // Get the red and blue values from the dust map
    const dustR = dustMap.bitmap.data[idx];
    const dustB = 255 - dustMap.bitmap.data[idx+2];

    // Red channel has more detail, blue channel provides a decent mask when inverted.
    // Mask the red channel with the inverse of the blue channel, then add 50% of the blue channel to flesh it out. Clamp at 255
    const dustRMasked = (dustR / 255.0) * (dustB / 255.0) * 255
    const dust = screen(dustRMasked, 0.5 * dustB);

    const ir = interpolate(72, 178, 0, 255, irMap.bitmap.data[idx]);

    // Apply gamma correction to infrared to brighten lower levels
    const irGammaCorrected = gamma(1.46, ir);

    // Combine IR and dust
    const outputValue = gamma(2.0, screen(dust, irGammaCorrected*0.77))

    // We use the visible light map to pick up details like smaller clouds that might have been missed in the IR-based images
    // This only works for areas in daylight but it improves the detail in those areas significantly
    // Sample value from visible
    const visibleR = visibleMap.bitmap.data[idx];
    const visibleG = visibleMap.bitmap.data[idx+1];
    const visibleB = visibleMap.bitmap.data[idx+2];

    // Find the difference between the largest and the smallest RGB value, so that we can see if it's greyscale-ish
    const visibleDiff = Math.max(visibleR, visibleG, visibleB) - Math.min(visibleR, visibleG, visibleB);

    // Find the difference between G and B - if they're similar and more than red it's probably teal-ish
    const visibleGBDiff = Math.abs(visibleG - visibleB)

    if(visibleDiff < 25 || (visibleR < visibleG && visibleGBDiff < 11 && visibleG > 150)) {
      // This value looks white, black or grey so we apply gamma correction to brighten it up then lighten the output image with it
      const visibleValue = gamma(1.5, Math.max(visibleR, visibleG, visibleB));
      cloudMap.bitmap.data[idx] = Math.max(visibleValue, outputValue);
      cloudMap.bitmap.data[idx + 1] = Math.max(visibleValue, outputValue);
      cloudMap.bitmap.data[idx + 2] = Math.max(visibleValue, outputValue);
    } else {
      // The visible value looks coloured so just use the IR-based output value
      cloudMap.bitmap.data[idx] = outputValue;
      cloudMap.bitmap.data[idx + 1] = outputValue;
      cloudMap.bitmap.data[idx + 2] = outputValue;
    }

    // The source images are missing data at the very left and very right (the antimeridian). We've combined the images
    // the wrong way round so this gap is in the middle of our image. We're going to fill the gap in.

    // We skip the poles because they'll be filled in with a mirror image later on
    if(y > cloudMap.bitmap.height / 8 && y < cloudMap.bitmap.height - cloudMap.bitmap.height / 8) {
      const thisPixelVal = cloudMap.bitmap.data[idx];

      // We go this many pixels left and right of any gaps, because the pixels right next to the gap often have odd values
      const GAP_BUFFER = 3;

      if(thisPixelVal === 255 && gapStartX == null) {
        // This is the start of a gap
        gapStartX = x - GAP_BUFFER;
        gapStartVal = cloudMap.bitmap.data[idx - 4 * GAP_BUFFER];
      } else if(gapStartX != null && thisPixelVal < 255 && afterGapCounter < GAP_BUFFER) {
        // This is after the gap but we haven't overshot by enough yet
        afterGapCounter++;
      } else if(thisPixelVal < 255 && gapStartX != null && afterGapCounter === GAP_BUFFER) {
        // We're at the end of our overshoot, so now fill in the gap
        gapEndX = x;
        gapEndVal = thisPixelVal;

        // We're going to create a gradient between the start pixel and the end pixel
        // How much is added to the start pixel value per pixel?
        const addedPerStep = (gapEndVal - gapStartVal) / (gapEndX - gapStartX)

        // Fill in every pixel in the gap
        for(let gapX = gapStartX; gapX <= gapEndX; gapX++) {
          const pixelIndexInGap = gapX - gapStartX;
          let newPixelValue = gapStartVal + pixelIndexInGap * addedPerStep;

          if(newPixelValue > 255) { newPixelValue = 255; }
          if(newPixelValue < 0) { newPixelValue = 0; }
          cloudMap.setPixelColor(Jimp.rgbaToInt(newPixelValue, newPixelValue, newPixelValue, 255), gapX, y)
        }

        gapStartX = null;
        gapEndX = null;
        gapStartVal = null;
        gapEndVal = null;
        afterGapCounter = 0;
      }
    }

  });

  // Move the left half of the image to the right and the right to the left so our map is centred on the meridian
  const cloudMapRight = cloudMap.clone().crop(0,0, cloudMap.bitmap.width / 2, cloudMap.bitmap.height)
  cloudMap.blit(cloudMap, 0, 0, cloudMap.bitmap.width / 2, 0, cloudMap.bitmap.width / 2, cloudMap.bitmap.height);
  cloudMap.blit(cloudMapRight, cloudMap.bitmap.width / 2, 0);

  // There's no data at the poles, so we'll mirror the image at the top and the bottom to cover the gap
  const cloudMapFlipped = cloudMap.clone().flip(false, true)
  const heightToMirror = cloudMap.bitmap.height / 8
  // Copy the bottom of the mirrored image to the top of the cloud map
  cloudMap.blit(cloudMapFlipped, 0, 0, 0, cloudMap.bitmap.height - heightToMirror*2, cloudMap.bitmap.width, heightToMirror)
  // Copy the top of the mirrored image to the bottom of the cloud map
  cloudMap.blit(cloudMapFlipped, 0, cloudMap.bitmap.height - heightToMirror, 0, heightToMirror, cloudMap.bitmap.width, heightToMirror)

  // Add frame to cover edges
  cloudMap
    .composite(frame.resize(cloudMap.bitmap.width, cloudMap.bitmap.height), 0, 0);

  // Save the cloud map
  console.log('Saving cloud map image');
  saveImageResolutions(cloudMap, 'clouds', ['jpg']);

  // Create version with alpha channel
  const cloudMapWithAlpha = cloudMap.clone();

  // Create blurred version that we'll use to shade the edges a bit to give more texture
  const cloudMapEdges = cloudMap.clone().gaussian(3).brightness(0.5)

  cloudMapWithAlpha.scan(0, 0, cloudMapWithAlpha.bitmap.width, cloudMapWithAlpha.bitmap.height, function(x, y, idx) {
    // Copy red value to alpha value (we're greyscale so r, g and b will all be identical)
    this.bitmap.data[idx + 3] = this.bitmap.data[idx]

    // Get value from edge map
    const edgeValue = cloudMapEdges.bitmap.data[idx]
    const val = multiply(255, edgeValue)

    // Set output colour
    this.bitmap.data[idx] = val;
    this.bitmap.data[idx + 1] = val;
    this.bitmap.data[idx + 2] = val;
  });

  // Save the cloud map with alpha
  console.log('Saving cloud map with alpha image');
  saveImageResolutions(cloudMapWithAlpha.colorType(4), 'clouds-alpha', ['png']);

  // Create inverted cloud map for shadows and night image
  const invertedCloudMap = cloudMapWithAlpha.clone().invert();

  const shadowMap = invertedCloudMap.clone().gaussian(3);

  // Save the earth image
  console.log('Saving earth image');
  earthWithoutClouds
    .resize(cloudMap.bitmap.width, cloudMap.bitmap.height, Jimp.RESIZE_HERMITE)
    .composite(shadowMap, 0, 3, {mode: 'multiply', opacitySource: 0.55, opacityDest: 1})
    .composite(cloudMapWithAlpha, 0, 0,  {
      opacitySource: 1,
      opacityDest: 1
    });

  saveImageResolutions(earthWithoutClouds, 'earth', ['jpg']);

  // Save the night earth image
  console.log('Saving night earth image');
  earthWithoutCloudsNight
    .resize(cloudMap.bitmap.width, cloudMap.bitmap.height, Jimp.RESIZE_HERMITE)
    .composite(invertedCloudMap, 0, 0,  {
      mode: Jimp.BLEND_MULTIPLY,
      opacitySource: 1,
      opacityDest: 1
    });

  saveImageResolutions(earthWithoutCloudsNight, 'earth-night', ['jpg']);

  // Save the specular map
  console.log('Saving specular map image');
  specularBase
    .resize(cloudMap.bitmap.width, cloudMap.bitmap.height, Jimp.RESIZE_HERMITE)
    .composite(invertedCloudMap, 0, 0,  {
      mode: Jimp.BLEND_MULTIPLY,
      opacitySource: 1,
      opacityDest: 1
    });

  saveImageResolutions(specularBase, 'specular', ['jpg']);
}

function saveImageResolutions(image, filename, formats) {
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  formats.forEach(format => {
    for(let i = 0; i < 4; i++) {
      const scale = 2**i;
      const width = SOURCE_WIDTH/scale;
      const height = SOURCE_HEIGHT/scale;
      const clone = image.clone();

      const outputSubdir = `${OUTPUT_DIR}/${width}x${height}`;
      if (!fs.existsSync(outputSubdir)){
        fs.mkdirSync(outputSubdir, { recursive: true });
      }

      clone
        .resize(SOURCE_WIDTH/scale, SOURCE_HEIGHT/scale)
        .quality(80)
        .write(`${outputSubdir}/${filename}.${format}`)
    }
  })
}

