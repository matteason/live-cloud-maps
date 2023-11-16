# Live cloud maps 🌍

This project provides free, near real-time, high resolution cloud maps of the whole Earth. You can use them for whatever you like, including 3D modelling in software like Blender or Xplanet, or in 2D graphics.

Here's the latest image:

![A flat map of Earth with clouds](https://clouds.matteason.co.uk/images/1024x512/earth.jpg)

**TL;DR: If you need a high-res greyscale almost-live cloud map, use this URL:**

[https://clouds.matteason.co.uk/images/8192x4096/clouds.jpg](https://clouds.matteason.co.uk/images/8192x4096/clouds.jpg)

Other formats and resolutions are shown below.

If you have any feedback you can [raise an issue](https://github.com/matteason/live-cloud-maps/issues/new), [start a discussion](https://github.com/matteason/live-cloud-maps/discussions/new) or tweet me ([@MattEason](https://twitter.com/MattEason))

If you find this project useful and you're feeling spendy, you can <a href='https://ko-fi.com/R5R2CWXB1' target='_blank'>support me on Ko-Fi</a>:

<a href='https://ko-fi.com/R5R2CWXB1' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contents
* [Frequency & availability](#frequency--availability)
* [Available images](#available-images)
* [Limitations](#limitations)
* [Licence & attribution](#licence--attribution)

## Frequency & availability
Images are updated eight times a day, every three hours, and pushed to `clouds.matteason.co.uk`. If you configure your software to
use `https://clouds.matteason.co.uk/images/[RESOLUTION]/[FILENAME]` you'll always stay up-to-date.

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is enabled, so you can use the latest daily images directly in JavaScript - for example, in a [three.js TextureLoader](https://threejs.org/docs/#api/en/loaders/TextureLoader).

I can't guarantee the freshness or quality of images; source data may not be available, or may be temporarily degraded.

## Available images

The following images are created every three hours. All images are available in four resolutions: 8192x4096, 4096x2048, 2048x1024 or 1024x512.

The images shown are the latest images available.

### Earth with clouds (day): `earth.jpg`

![A flat map of Earth with clouds](https://clouds.matteason.co.uk/images/1024x512/earth.jpg)

The cloud map overlaid on NASA's
[The Blue Marble: Land Surface, Ocean Color and Sea Ice](https://visibleearth.nasa.gov/images/57730/the-blue-marble-land-surface-ocean-color-and-sea-ice)
image.

<details>
  <summary>Earth with clouds (day) image URLs (all resolutions)</summary>
These URLs are for the latest images:

* [1024x512 Earth with clouds (day)](https://clouds.matteason.co.uk/images/1024x512/earth.jpg)
* [2048x1024 Earth with clouds (day)](https://clouds.matteason.co.uk/images/2048x1024/earth.jpg)
* [4096x2048 Earth with clouds (day)](https://clouds.matteason.co.uk/images/4096x2048/earth.jpg)
* [8192x4096 Earth with clouds (day)](https://clouds.matteason.co.uk/images/8192x4096/earth.jpg)
</details>

### Cloud map: `clouds.jpg`

![A greyscale cloud map](https://clouds.matteason.co.uk/images/1024x512/clouds.jpg)

A greyscale cloud map. Layer this over an image of Earth (and set the blending mode to 'screen' if necessary).

<details>
  <summary>Cloud map image URLs (all resolutions)</summary>
These URLs are for the latest images:

* [1024x512 cloud map](https://clouds.matteason.co.uk/images/1024x512/clouds.jpg)
* [2048x1024 cloud map](https://clouds.matteason.co.uk/images/2048x1024/clouds.jpg)
* [4096x2048 cloud map](https://clouds.matteason.co.uk/images/4096x2048/clouds.jpg)
* [8192x4096 cloud map](https://clouds.matteason.co.uk/images/8192x4096/clouds.jpg)
</details>


### Cloud map (alpha): `clouds-alpha.png`

![A greyscale cloud map with transparency](https://clouds.matteason.co.uk/images/1024x512/clouds-alpha.png)

The same as above, but as a PNG with alpha transparency (the preview above may not be visible if you use light mode)

<details>
  <summary>Cloud map (alpha) image URLs (all resolutions)</summary>
These URLs are for the latest images:

* [1024x512 cloud map (alpha)](https://clouds.matteason.co.uk/images/1024x512/clouds-alpha.png)
* [2048x1024 cloud map (alpha)](https://clouds.matteason.co.uk/images/2048x1024/clouds-alpha.png)
* [4096x2048 cloud map (alpha)](https://clouds.matteason.co.uk/images/4096x2048/clouds-alpha.png)
* [8192x4096 cloud map (alpha)](https://clouds.matteason.co.uk/images/8192x4096/clouds-alpha.png)
</details>


### Earth with clouds (night): `earth-night.jpg`

![A flat map of Earth at night with clouds obscuring the lights usually visible in populated areas](https://clouds.matteason.co.uk/images/1024x512/earth-night.jpg)

The cloud map overlaid on NASA's
[Earth at Night](https://earthobservatory.nasa.gov/features/NightLights)
image. You can combine this with the day image using some fancy shader magic to create day/night transitions:

![A rendering of the eastern hemisphere, half in daylight and half in darkness, with city lights showing](https://user-images.githubusercontent.com/1935173/181506151-764c80c3-1069-4d62-b294-34d00d2ed319.png)

<details>
  <summary>Earth with clouds (night) image URLs (all resolutions)</summary>
These URLs are for the latest images:

* [1024x512 Earth with clouds (night)](https://clouds.matteason.co.uk/images/1024x512/earth-night.jpg)
* [2048x1024 Earth with clouds (night)](https://clouds.matteason.co.uk/images/2048x1024/earth-night.jpg)
* [4096x2048 Earth with clouds (night)](https://clouds.matteason.co.uk/images/4096x2048/earth-night.jpg)
* [8192x4096 Earth with clouds (night)](https://clouds.matteason.co.uk/images/8192x4096/earth-night.jpg)
</details>

### Specular map: `specular.jpg`

![A flat map of Earth with clouds and the Earth's surface in black and the sea in white](https://clouds.matteason.co.uk/images/1024x512/specular.jpg)

You can use this specular map to make your model more realistic by only showing specular highlights on bodies of water:

![A specular highlight on the sea off the west coast of Africa](https://user-images.githubusercontent.com/1935173/181506465-9a97c504-dceb-4c91-9642-6bd904fb868f.png)

<details>
  <summary>Specular image URLs (all resolutions)</summary>
These URLs are for the latest images:

* [1024x512 specular](https://clouds.matteason.co.uk/images/1024x512/specular.jpg)
* [2048x1024 specular](https://clouds.matteason.co.uk/images/2048x1024/specular.jpg)
* [4096x2048 specular](https://clouds.matteason.co.uk/images/4096x2048/specular.jpg)
* [8192x4096 specular](https://clouds.matteason.co.uk/images/8192x4096/specular.jpg)
</details>


## Limitations
The generated images have some limitations due to the source data.

### Poles
The satellites do not capture the polar regions. To compensate for this, the top and bottom of the image are mirrored to cover the gap. These regions aren't very visible on 3D images anyway, and most of the area is covered by the ice caps which makes the clouds even less visible.

### Holes
Occasionally, the satellites capturing the source data will miss some regions. These areas will appear as square-ish
holes without clouds.

## Licence & attribution

The cloud data used for these images is provided by EUMETSAT. You must provide the following attribution to them, per their [licensing](https://www.eumetsat.int/eumetsat-data-licensing):

> Contains modified EUMETSAT data

The Earth image is provided by NASA. Because it's a work of the US government, it's in the public domain.

I've also released the code and images in this repository into the public domain using the
[CC0 1.0 Universal licence](https://creativecommons.org/publicdomain/zero/1.0/).

I'd appreciate an attribution if you use the code or images, but it's not necessary. I'd love to know how you're using this project - get in touch on X/Twitter [@MattEason](https://twitter.com/MattEason) or email clouds@matteason.co.uk.

Images are processed with the help of the excellent [JIMP](https://github.com/oliver-moran/jimp) image manipulation library.

If you find this project useful, you can <a href='https://ko-fi.com/R5R2CWXB1' target='_blank'>support me on Ko-Fi</a>:

<a href='https://ko-fi.com/R5R2CWXB1' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

