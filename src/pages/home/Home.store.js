// create mobx store
import {makeAutoObservable, observable} from 'mobx';
import {persist} from 'mobx-persist';

export class HomeStore {
  onCall = false;
  callStatus = '';
  isConnected = true;
  weatherRain = false;
  splashShow = true;
  inAppUpdate = false;
  pickupLocation = null;
  destinationLocation = null;
  @observable defaultLanguage = 'id';

  constructor() {
    makeAutoObservable(this);
  }

  // Set PickUp Location
  setPickUpLocationAddress(long, lat, address, header) {
    this.pickupLocation = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address?.slice(0, address.indexOf(',')),
    };
  }

  // Set Destination Location
  setDestinationLocationAddress(long, lat, address, header) {
    this.destinationLocation = {
      lat: lat,
      lng: long,
      address: address,
      header: header ? header : address?.slice(0, address.indexOf(',')),
    };
  }
}
