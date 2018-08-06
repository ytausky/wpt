importScripts('/webusb/resources/usb-helpers.js');
'use strict';

// Load resources to allow the worker to attach itself to the parent context.
loadResources().then(async () => {
  await navigator.usb.test.attachToWindow();

  onmessage = messageEvent => {
    if (messageEvent.data.type === 'Ready') {
      navigator.usb.addEventListener('connect', connectEvent => {
        connectEvent.device.open().then(() => {
          postMessage({ type: 'Success' });
        }).catch(error => {
          postMessage({ type: `FAIL: open rejected ${error}` });
        });
      });
      postMessage({ type: 'Ready' });
    }
  };

  postMessage({ type: 'Loaded' });
});
