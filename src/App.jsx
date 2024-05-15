import { useEffect, useRef, useState } from 'react';

import logoImg from './assets/logo.png';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import Modal from './components/Modal.jsx';
import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import { sortPlacesByDistance } from './loc.js';




const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map(id=> AVAILABLE_PLACES.find((place) => place.id === id));


function App() {
  
  const selectedPlace = useRef();
  const [modalIsOpen, setModelIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(()=>{
navigator.geolocation.getCurrentPosition((position)=>{
   const sortPlacesnearLoc =  sortPlacesByDistance(AVAILABLE_PLACES,position.coords.latitude,position.coords.longitude);
   setAvailablePlaces(sortPlacesnearLoc);
  });
  },[])

function handleStartRemovePlace(id) {
   setModelIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModelIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });


   const storedIds =  JSON.parse(localStorage.getItem('selectedPlaces')) || [];

   if(storedIds.indexOf(id) === -1) {
    localStorage.setItem('selectedPlaces',JSON.stringify([id, ...storedIds]));
   }
   
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModelIsOpen(false);
    const storedIds =  JSON.parse(localStorage.getItem('selectedPlaces')) || [];
localStorage.setItem('selectedPlaces',JSON.stringify(storedIds.filter((id)=> id!==selectedPlace.current)))

  }

  return (
    <>
     { modalIsOpen &&  <Modal ref={modal} open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>}

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting Places by Near your Location..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
