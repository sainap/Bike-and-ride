# Bike and Ride
<img src="https://github.com/sainap/bike-and-ride/blob/main/lib/icon128.png" align="left" alt="Bike and Ride logo by Sayna Parsi">
Chrome extension to show commute time using a bike and public transit for home buyers on Redfin.

This project was inspired by the process of home shopping. Finding a home is tough, but finding a home that has a reasonably short commute - if you don't drive is a whole different story.

![Bike and Ride screenshot example](https://chrome.google.com/webstore/detail/bikeride/infhpbjmcjhdbchempmppkolaaggebko?hl=en&authuser=0)



### Built With
This project was built using:
* [HERE Technologies Geocoding API](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/quick-start.html): to get the latitude and longitude for the home address and commute locations.
* [HERE Technologies Intermodal Routing API](https://developer.here.com/documentation/intermodal-routing/dev_guide/private-bike-and-ride/index.html): to calculate commute duration,
* [AWS Lambda](https://aws.amazon.com/lambda/): to mask the API key for API calls and throttle usage.


### How does it work?
First, in `main.js` we identify the address of the home and commute locations based on the JS path of the elements. We then geocode these addresses to pass latitude and longitudes of them to the intermodal routing API to ultimately get the duration. We send a `message` to `background.js` where the actual call to the lambda is made.

Here's an example of data from a geocoding call:
```
{ lat: 47.66507, lng: -122.3025 }
```
Here's an example of data from an intermodal routing call:
```
{duration: "20 mins"}
```
ultimately, `main.js` creates a new element on the page to display the bike and ride duration.

Note: The API call to intermodal routing currently calculates the duration of the route for a scenario where arrival is set to 8 am for the day that the call is made. I am not sure how Redfin estimates the commute time, but I think they calculate it during the commute hours based on a few examples I checked manually. You may occasionally get commutes that are longer than the commute listed by Redfin the reason is that we are calculating the commute at different times so this is partially why! :)


### License

Distributed under the GNU v3 license. See `LICENSE` for more information.


### Contact

Sayna Parsi - [@sainaparsi](https://twitter.com/sainaparsi)