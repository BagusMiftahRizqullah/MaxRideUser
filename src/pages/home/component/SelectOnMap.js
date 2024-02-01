import {StyleSheet, TouchableOpacity, Text, TextInput} from 'react-native';
import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import {VStack, HStack, Spacer, Button} from '@components';
import {CustomSpacing, Fonts, Colors} from '@styles';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import Dash from 'react-native-dash';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {ScrollView} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  MyLocation,
  CombineShape,
  ic_location,
  BlackClose,
  PickUp,
  DropOff,
  Revers,
  Dot,
  Clock,
  maxBike,
  maxCar,
  maxBig,
  maxTruk,
  mapGrey,
  clockGrey,
  dollarGrey,
  ic_cash,
  ic_check,
  ic_check_disable,
  profile_default,
  ic_star,
  ic_home,
} from '@assets';

Geocoder.init('AIzaSyAsI0vNPe8JNzLfI1ltcElk-mRaEOjiv2c');
const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.009;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SelectOnMap = observer(() => {
  const {homeStore} = useStores();
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '25%'], []);

  useEffect(() => {
    bottomSheetRef.current?.present();
    mapRef.current.animateToRegion({
      latitude: homeStore.pickupLocation?.lat,
      longitude: homeStore.pickupLocation?.lng,
      latitudeDelta: LATITUDE_DELTA * 0.8,
      longitudeDelta: LONGITUDE_DELTA * 0.8,
    });
  }, []);

  const getLocConvertAddress = async (lat, long) => {
    Geocoder.from(lat, long)
      .then(json => {
        const res = json.results[0].formatted_address;
        console.log('FindLocation', lat, long);
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        homeStore.setPickUpLocationAddress(long, lat, address);

        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA * 0.8,
          longitudeDelta: LONGITUDE_DELTA * 0.8,
        });
      })
      .catch(error => console.warn(error));
  };

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  console.log('address', homeStore.pickupLocation?.address);

  return (
    <VStack style={{backgroundColor: '#fff', flex: 1}}>
      <MapView
        customMapStyle={styles.mapStyle}
        onPress={e => {
          getLocConvertAddress(
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude,
          );
        }}
        ref={mapRef}
        initialRegion={{
          latitude: homeStore.pickupLocation?.lat
            ? parseFloat(homeStore.pickupLocation?.lat)
            : 0.1,
          longitude: homeStore.pickupLocation?.lng
            ? parseFloat(homeStore.pickupLocation?.lng)
            : 0.1,
          latitudeDelta: LATITUDE_DELTA * 5,
          longitudeDelta: LONGITUDE_DELTA * 5,
        }}
        style={{
          flex: 1,
        }}
        zoomEnabled={true}
        showsMyLocationButton={false}
        showsUserLocation={true}
        tintColor={'#000000'}>
        <Marker
          coordinate={{
            latitude: parseFloat(homeStore.pickupLocation?.lat),
            longitude: parseFloat(homeStore.pickupLocation?.lng),
          }}
        />
      </MapView>
      <BottomSheetModalProvider>
        <VStack>
          <BottomSheetModal
            enableContentPanningGesture={false}
            keyboardBehavior="fillParent"
            enablePanDownToClose={false}
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <VStack
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                paddingHorizontal: CustomSpacing(16),
                paddingTop: CustomSpacing(24),
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}>
              <Text
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                PickUp position
              </Text>
              <Spacer height={CustomSpacing(12)} />
              <Text
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  fontSize: 23,
                }}>
                {homeStore.pickupLocation?.header
                  ? homeStore.pickupLocation?.header
                  : ''}
              </Text>
              <Spacer height={CustomSpacing(12)} />
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <VStack
                  style={{
                    justifyContent: 'center',
                    paddingHorizontal: CustomSpacing(102),
                    alignItems: 'center',
                    height: CustomSpacing(49),
                    backgroundColor: '#000000',
                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 23,
                    }}>
                    Confirmed
                  </Text>
                </VStack>
              </TouchableOpacity>

              {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
            </VStack>
          </BottomSheetModal>
        </VStack>
      </BottomSheetModalProvider>
    </VStack>
  );
});

export default SelectOnMap;

const styles = StyleSheet.create({
  containerMap: {
    backgroundColor: '#fff',
    flex: 1,
  },
  mapStyle: [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#7c93a3',
        },
        {
          lightness: '-10',
        },
      ],
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#a0a4a5',
        },
      ],
    },
    {
      featureType: 'administrative.province',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#62838e',
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#dde3e3',
        },
      ],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#3f4a51',
        },
        {
          weight: '0.30',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'all',
      stylers: [
        {
          visibility: 'simplified',
        },
      ],
    },
    {
      featureType: 'poi.attraction',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi.business',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.government',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'all',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'poi.place_of_worship',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.school',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'poi.sports_complex',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [
        {
          saturation: '-100',
        },
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#bbcacf',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          lightness: '0',
        },
        {
          color: '#bbcacf',
        },
        {
          weight: '0.50',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'on',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#ffffff',
        },
      ],
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#a9b4b8',
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [
        {
          invert_lightness: true,
        },
        {
          saturation: '-7',
        },
        {
          lightness: '3',
        },
        {
          gamma: '1.80',
        },
        {
          weight: '0.01',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a3c7df',
        },
      ],
    },
  ],
});
