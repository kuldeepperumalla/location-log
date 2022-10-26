("use strict");
// prettier-ignore

// importing HTML elemtns from elements.js
import {
  months,
  form,
  containerWorkouts,
  inputType,
  inputDistance,
  inputDuration,
  inputCadence,
  inputElevation,
} from "./elements.js";

// App functionality

class Workout{
    date = new Date();
    id = (Date.now()+''.slice(-10))
    constructor(coords, distance, duration){
        // this.date;
        // this.id 
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription(){

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
    
}

class Running extends Workout{
    type = 'running'
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.cadence = cadence;
        this.clacPace();
                this._setDescription();

    }

    clacPace(){
        this.pace = this.duration / this.distance
        return this.pace
    }
};
class Cycling extends Workout {
    type = 'cycling'
  constructor(coords, distance, duration, elevationGain) {
            super(coords, distance, duration);
            this.elevationGain = elevationGain;
            this.clacSpeed();
                    this._setDescription();

  }

  clacSpeed(){
    this.speed = this.distance / this.duration
    return this.speed
  }
}


class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    // Eventlisteners
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get the location");
        }
      );
    }
  }

  _loadMap(e) {
    const { latitude } = e.coords;
    const { longitude } = e.coords;
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 14);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm(){
    // hide the form and clear the input list
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(()=> (form.style.display = 'grid'),1000)
  }

  _toggleElevationField() {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp>0)

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const {lat, lng} = this.#mapEvent.latlng;
    let workout = []

    // If workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      // Check if the data is valid
      if (
        //   !Number.isFinite(distance) ||
        //   !Number.isFinite(duration) ||
        //   !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
        return alert("Inputs have to be positive numbers");
        workout = new Running([lat, lng], distance, duration, cadence)
    }
    // If workout cycling, create running object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        //   !Number.isFinite(distance) ||
        //   !Number.isFinite(duration) ||
        //   !Number.isFinite(cadence)
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      )
        return alert("Inputs have to be positive numbers");
        workout = new Cycling(
                  [lat, lng],
                  distance,
                  duration,
                  elevation
                );

    }
    // Add new object to workout array
this.#workouts.push(workout);
console.log(this.#workouts);
    // clear input fileds
    // Display Marker
    // Render workout on map as marker
this._renderWorkoutMarker(workout)
      //   render workout on the list
this._renderWorkout(workout);

// hode form + clear input fields
this._hideForm();

    }

    _renderWorkoutMarker(workout){
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === 'running'? '🏃‍♂️' : '🚴‍♂️'} ${workout.description}`)
      .openPopup();
    }

    _renderWorkout(workout){
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running'? '🏃‍♂️' : '🚴‍♂️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">24</span>
            <span class="workout__unit">min</span>
          </div>
        `;

        if(workout.type === 'runiing')
        html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
           <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
        `;
        
        if (workout.type === "cycling")
          html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
           <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">spm</span>
            </div>
        `;

        form.insertAdjacentHTML('afterend', html)
    }
}

const app = new App();

