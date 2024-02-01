import React, {useEffect, useState} from 'react';
import {
  View,
  Animated,
  Easing,
  Image,
  Dimensions,
  Platform,
  Text,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import {CustomSpacing, Layout, Colors, Fonts} from '@styles';
import {VStack, HStack, Spacer} from '@components';
import {LogoWhite} from '@assets';
import {useNavigation} from '@react-navigation/native';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
const {width, height} = Dimensions.get('window');

const Splash = observer(() => {
  const navigation = useNavigation();
  const {homeStore} = useStores();
  const [location, setLocation] = useState(null);
  const [permissionLocationStatus, setPermissionLocationStatus] =
    useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');

        if (granted === 'granted') {
          return true;
        } else {
          console.log('IOS NOT GRANTED LOCATION');

          return false;
        }
      } catch (err) {
        console.log('Permission error', err);

        return false;
      }
    } else {
      try {
        // const isGranted = await MapboxGL.requestAndroidLocationPermissions();
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message:
              'Hayuq App requires your location permission to be able to deliver your orders and show you restaurants around you',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === 'granted') {
          console.log('ANDROID GRANTED LOCATION');

          return true;
        } else {
          console.log('ANDROID NOT GRANTED LOCATION');

          return false;
        }
      } catch (err) {
        console.log('Permission error', err);

        return false;
      }
    }
  };
  const getLocConvertAddress = async (lat, long) => {
    Geocoder.from(lat, long)
      .then(json => {
        const res = json.results[0].formatted_address;
        console.log('FindLocation', lat, long);
        const address = res.replace(/^[^,]*\+[^,]*,/, '');
        homeStore.setPickUpLocationAddress(long, lat, address);
      })
      .catch(error => console.warn(error));
  };

  const getLocation = async () => {
    const result = requestLocationPermission();

    await result
      .then(res => {
        if (res) {
          Geolocation.getCurrentPosition(
            position => {
              console.log('LOCATION', Platform.OS, position);

              setLocation(position.coords);
              getLocConvertAddress(
                position.coords.latitude,
                position.coords.longitude,
              );
            },
            error => {
              console.log('locationManager Error: ', error);
              setLocation(null);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      })
      .catch(Err => console.log('Error', Err));
  };

  useEffect(() => {
    // setTimeout(() => {
    //   navigation.navigate('SplashPermission');
    // }, 1000);

    getLocation();
  }, []);

  // create a function to render the loading image

  return (
    <View style={[{backgroundColor: '#0D1722'}, Layout.heightFull]}>
      <VStack
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <FastImage
          style={{
            width: CustomSpacing(100),
            height: CustomSpacing(100),
          }}
          source={LogoWhite}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Spacer height={CustomSpacing(12)} />
        <HStack>
          <Text
            style={[
              Fonts.h1,
              {
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 32,
              },
            ]}>
            Max
          </Text>
          <Text
            style={[
              Fonts.h1,
              {
                color: '#2DBB54',
                fontWeight: 'bold',
                fontSize: 32,
              },
            ]}>
            Ride
          </Text>
        </HStack>
        <Spacer height={CustomSpacing(100)} />
        <VStack
          style={{
            position: 'absolute',
            bottom: CustomSpacing(32),
          }}>
          <Text
            style={[
              Fonts.subhead,
              {color: '#fff'},
            ]}>{`Version ${DeviceInfo.getVersion()}`}</Text>
        </VStack>
      </VStack>
    </View>
  );
});

export default Splash;
