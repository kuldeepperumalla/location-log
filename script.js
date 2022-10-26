"use strict";
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// HTML ELEMTNS

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//////////////////////////////////////

let map, mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (e) => {
      const { latitude } = e.coords;
      const { longitude } = e.coords;
      console.log(`https://www.google.com/maps/@${latitude},-${longitude},15z`);
      const coords = [latitude, longitude];
      map = L.map("map").setView(coords, 14);
      console.log(map);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

    //   Handling clicks on Map
      map.on("click", function (mapE) {
        mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
      });

    },
    function () {
      alert("Could not get the location");
    }
  );
}

// Eventlisteners
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // clear input fileds
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
    
    // Display Marker
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Work out")
    .openPopup();

});
