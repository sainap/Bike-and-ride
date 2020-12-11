// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.contentScriptQuery === 'geocode') {
    const url = `https://5e6syzy3e3.execute-api.us-west-2.amazonaws.com/default/geocode?address=${
      encodeURIComponent(message.address)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
  } else if (message.contentScriptQuery === 'bikeride') {
    const url = `https://v5a7p64ixk.execute-api.us-west-2.amazonaws.com/default/bikeride?trip=${
      encodeURIComponent(JSON.stringify(message.trip))}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        sendResponse(data);
      });
  }
  return true;
});
