// returns the address of the property being viewed
function getHomeAddress() {
  return document.getElementsByClassName("homeAddress-variant")[0].textContent;
}

// returns set of destinations
function getDestinations() {
  return new Promise((resolve) => {
    const destinations = new Set();
    // commutes only load when user has scrolled down so we have to wait
    // eslint-disable-next-line no-unused-vars
    const observer = new MutationObserver((mutations) => {
      const commutes = document.getElementsByClassName('Commutes');
      if (commutes[0] !== undefined) {
        const commuteOptions = commutes[0].children;
        // last item is a button to add a new commute so -2
        for (let i = 1; i < commuteOptions.length; i += 1) {
          let destination = document.querySelector(`#miniMap-collapsible > div.sectionContentContainer.expanded > div > div > div > div.Commutes.font-size-base > div:nth-child(${i}) > div > div:nth-child(2) > span:nth-child(2)`).textContent;
          if (destination.startsWith('to ')) {
            destination = destination.slice(2, destination.length - 1);
          }
          destinations.add(destination);
        }
        if (destinations !== undefined) {
          observer.disconnect();
          resolve(destinations);
        }
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// returns geocoordinates for a given address
// for example {lat:123.4, lng: 123,4}
function geocode(location) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { contentScriptQuery: 'geocode', address: location }, (data) => {
        if (data === undefined) {
          reject(new Error('Was not able to geocode', location));
        } else {
          resolve(data);
        }
      },
    );
  });
}

// takes lat long objects for origin and destination
// returns commute duration in seconds
async function getCommuteDuration(origin, destination) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { contentScriptQuery: 'bikeride', trip: { origin, destination } }, (data) => {
        if (data === undefined) {
          reject(new Error(`Was not able to get commute between ${origin} and ${destination}.`));
        } else {
          resolve(data);
        }
      },
    );
  });
}

// displays bikeride commute on page
function displayBikeRide(duration, address) {
  const commuteCollection = document.getElementsByClassName('Commutes font-size-base');
  const commuteParent = commuteCollection[0];
  let element = `<div class="Commute basic-border-radius"><span class="field select Select icon withFlyout withOptions mounted selected clickable optional" data-rf-test-name="Select"><span data-rf-test-name="Select" class="input" role="listbox" tabindex="0"><span class="container" style="margin: 0;padding: 0;display: flex;"><svg class="SvgIcon bikescore"><svg viewBox="0 0 24 24"><path d="M22.122 11.284c-1.817-1.505-3.316-1.451-4.647-1.022L15.17 6h3.58a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25h-6.835a.25.25 0 0 0-.221.367L13.615 8H8l-.641-1.016L8 7V5.25A.25.25 0 0 0 7.75 5h-4.5a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h1.828L6.39 9.056l-.566 1.027A4.981 4.981 0 0 0 5 10a5 5 0 0 0-5 5c0 2.703 2.297 5 5 5a5 5 0 0 0 5-5c0-.677-.138-1.321-.382-1.91l5.261-3.045.744 1.289a4.97 4.97 0 0 0-1.512 4.727c.399 1.919 1.962 3.468 3.887 3.842A5.006 5.006 0 0 0 24 15.046c.013-1.474-.742-2.822-1.878-3.762zm-14.929 5.91C4.73 19.087 2 17.356 2 15a2.993 2.993 0 0 1 2.754-2.975l-1.2 2.179a.244.244 0 0 0 .007.254c.189.288.667 1.002.899 1.348a.25.25 0 0 0 .332.077l3.069-1.776c.288.92.147 2.027-.668 3.087zm1.321-5.747a5.025 5.025 0 0 0-.855-.667l.392-.751h2.978l-2.515 1.418zm9.985 6.512a3.021 3.021 0 0 1-2.414-2.249 2.953 2.953 0 0 1 .581-2.571l1.343 2.327a.25.25 0 0 0 .342.092l1.305-.754a.249.249 0 0 0 .094-.335l-1.305-2.413c.858-.161 1.813-.057 2.99 1.439.318.405.548.898.564 1.413a3.005 3.005 0 0 1-3.5 3.051z" fill-rule="evenodd"></path></svg></svg>
  <svg class="SvgIcon transitscore"><svg viewBox="0 0 24 24"><path d="M18 1h-3V0H9v1H6a3 3 0 0 0-3 3v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a3 3 0 0 0-3-3zM5 12h14v5H5v-5zm14-2H5V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6zm-.875 14H20.5a.25.25 0 0 0 .2-.4l-2.625-3.5a.25.25 0 0 0-.2-.1H15.5a.25.25 0 0 0-.2.4l2.625 3.5a.25.25 0 0 0 .2.1zm-12.25 0H3.5a.25.25 0 0 1-.2-.4l2.625-3.5a.25.25 0 0 1 .2-.1H8.5a.25.25 0 0 1 .2.4l-2.625 3.5a.25.25 0 0 1-.2.1zM18 14.5a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 18 14.5zm-9 0a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 9 14.5z" fill-rule="evenodd"></path></svg></svg>
</span></span></span><div><span class="font-weight-bold">${duration} </span><span>to ${address}</span></div></div>`;
  const parser = new DOMParser();
  element = parser.parseFromString(element, 'text/html').body;
  commuteParent.prepend(element);
}

async function main() {
  getDestinations()
    .then((destinations) => {
      const homeaddress = getHomeAddress();

      geocode(homeaddress).then((homeCoord) => {
        console.log(homeCoord);
        destinations.forEach((destination) => {
          console.log(destination);
          geocode(destination).then((destinationCoord) => {
            console.log(destinationCoord);
            getCommuteDuration(homeCoord, destinationCoord).then((duration) => {
              displayBikeRide(duration.duration, destination);
            });
          });
        });
      });
    });
}

document.addEventListener('load', main());
