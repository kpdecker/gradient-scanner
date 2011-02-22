# gradient-scanner
Utility to generate CSS3 gradients from source raster files like mock images.

## Features
- Loading for mockup files via URL or local file access (File API)
- Scanning of a user selected section of text for possible gradients
- User adjustment of the gradient estimations with live preview
- Cross-browser gradient CSS generation

## Setup
### Checkout
    $ git clone git@github.com:kpdecker/gradient-scanner.git
    $ cd gradient-scanner
    $ git submodule update --init

### Development Requirements
Development of the app must be done over a HTTP connection (or connection other than file://) due to the canvas [security model](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#security-with-canvas-elements).

### Node Server Setup
In order to access files that are on URLs outside of the current server, we must proxy images due to the security model.

    $ npm install express

### Node Server Execution

    $ cd ./server
    $ node main.js

## Development Plan
Development currently mid-phase 1.

### Phase 1: Lowest Common Denominator
Implement support for only the features that are supported by both the latest WebKit and Mozilla implementations.

This amounts to:

- Linear gradients
- Radial gradients with a single center point
- Arbitrary number of color stops

### Phase 2: Single Feature Mode
Support the features that are specific to a single browser, attempting to best match the display for the other browser.

This will add support for radial gradients with multiple center points and repeating gradients.

### Phase 3: Automated Feature Detection
Implement automatic feature detection in addition to the user-input based system.
