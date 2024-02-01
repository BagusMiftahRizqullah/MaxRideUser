import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {dimensions} from '@config/Platform.config';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {VStack, HStack, Spacer, Button} from '@components';
import {ScrollView} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {CustomSpacing, Fonts, Colors} from '@styles';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import Dash from 'react-native-dash';
import {Rating, AirbnbRating} from 'react-native-ratings';
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

const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.009;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
Geocoder.init('AIzaSyAsI0vNPe8JNzLfI1ltcElk-mRaEOjiv2c');

const home = observer(() => {
  const {homeStore} = useStores();
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPointsSmall = useMemo(() => ['16%', '16%'], []);
  const snapPoints = useMemo(() => ['35%', '16%'], []);
  const snapPointsNewTrip = useMemo(() => ['70%', '16%'], []);
  const snapPointsReview = useMemo(() => ['90%', '16%'], []);
  const [newTrip, setNewTrip] = useState(false);
  const [stepNewTrip, setStepNewTrip] = useState(0);
  const [mySeat, setMySeat] = useState(1);
  const [myOption, setMyOption] = useState(0);
  const [statusSchedule, setStatusSchedule] = useState('NOW');
  const [paymentType, setPaymentType] = useState(0);
  const [haveDriver, setHaveDriver] = useState(false);
  const [star, setStar] = useState(0);
  const [tip, setTip] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleCreateTrip = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('70%');
  }, []);

  const handleCreateReview = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('90%');
  }, []);

  const handleCreateFinish = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('35%');
  }, []);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  useEffect(() => {
    if (stepNewTrip == 4) {
      setTimeout(() => {
        setNewTrip(true);
        setHaveDriver(true);
        setStepNewTrip(5);
        handleCreateReview();
      }, 5000);
    }
  }, [stepNewTrip]);

  // const requestLocationPermission = async () => {
  //   if (Platform.OS === 'ios') {
  //     try {
  //       const granted = await Geolocation.requestAuthorization('whenInUse');

  //       if (granted === 'granted') {
  //         return true;
  //       } else {
  //         console.log('IOS NOT GRANTED LOCATION');

  //         return false;
  //       }
  //     } catch (err) {
  //       console.log('Permission error', err);
  //       return false;
  //     }
  //   } else {
  //     try {
  //       // const isGranted = await MapboxGL.requestAndroidLocationPermissions();
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //           title: 'Geolocation Permission',
  //           message:
  //             'Hayuq App requires your location permission to be able to deliver your orders and show you restaurants around you',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );

  //       if (granted === 'granted') {
  //         console.log('ANDROID GRANTED LOCATION');

  //         return true;
  //       } else {
  //         console.log('ANDROID NOT GRANTED LOCATION');

  //         return false;
  //       }
  //     } catch (err) {
  //       console.log('Permission error', err);

  //       return false;
  //     }
  //   }
  // };
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

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('LOCATION', Platform.OS, position);

        getLocConvertAddress(
          position.coords?.latitude,
          position.coords?.longitude,
        );
      },
      error => {
        console.log('locationManager Error: ', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <VStack style={styles.containerMap}>
      {showSideMenu ? (
        <Animatable.View
          style={{
            alignSelf: 'flex-start',
            width: screenWidth,
            height: screenHeight,
            zIndex: 1001,
            position: 'absolute',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            opacity: 0.8,
          }}
          animation="bounceInLeft"
          delay={50}>
          <VStack
            style={{
              alignSelf: 'flex-start',
              width: screenWidth - CustomSpacing(60),
              height: screenHeight,
              zIndex: 1001,
              position: 'absolute',
              backgroundColor: '#fff',
              borderTopRightRadius: CustomSpacing(42),
            }}>
            <VStack>
              <VStack
                style={{
                  padding: CustomSpacing(23),
                }}>
                <HStack
                  style={{
                    justifyContent: 'space-between',
                  }}>
                  <HStack>
                    <FastImage
                      source={profile_default}
                      style={{
                        width: 43,
                        height: 43,
                        borderRadius: CustomSpacing(23),
                      }}
                    />
                    <Spacer width={CustomSpacing(12)} />
                    <VStack>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Hello, Ahmed
                      </Text>
                      <Spacer height={CustomSpacing(4)} />
                      <TouchableOpacity>
                        <Text
                          style={{
                            color: '#2DBB54',
                            fontSize: 13,
                          }}>
                          Edit Account
                        </Text>
                      </TouchableOpacity>
                    </VStack>
                  </HStack>
                  <TouchableOpacity onPress={() => setShowSideMenu(false)}>
                    <FastImage
                      source={BlackClose}
                      style={{
                        width: 23,
                        height: 23,
                        borderRadius: CustomSpacing(23),
                      }}
                    />
                  </TouchableOpacity>
                </HStack>
              </VStack>
              <VStack style={{padding: CustomSpacing(23)}}>
                <TouchableOpacity onPress={() => setShowSideMenu(false)}>
                  <HStack>
                    <VStack
                      style={{
                        backgroundColor: '#000000',
                        padding: CustomSpacing(8),
                        borderRadius: CustomSpacing(8),
                      }}>
                      <FastImage
                        source={ic_home}
                        style={{
                          width: 23,
                          height: 23,
                          borderRadius: CustomSpacing(23),
                        }}
                      />
                    </VStack>
                    <Spacer width={CustomSpacing(12)} />
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      Home
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </VStack>
          </VStack>
        </Animatable.View>
      ) : null}

      {newTrip && stepNewTrip == 0 ? (
        <Animatable.View
          style={{
            alignSelf: 'center',
            width: screenWidth,
            height: CustomSpacing(228),
            zIndex: 1001,
            position: 'absolute',
            backgroundColor: '#fff',
            borderBottomRightRadius: CustomSpacing(42),
            borderBottomLeftRadius: CustomSpacing(42),
          }}
          animation="bounceInDown"
          delay={50}>
          <VStack
            style={{
              padding: CustomSpacing(32),
            }}>
            <TouchableOpacity
              onPress={() => {
                setNewTrip(false);
                setStepNewTrip(0);
              }}>
              <FastImage
                source={BlackClose}
                style={{
                  width: 18,
                  height: 18,
                }}
              />
            </TouchableOpacity>
            <Spacer height={CustomSpacing(23)} />
            <VStack>
              <HStack>
                <FastImage
                  source={PickUp}
                  style={{
                    width: 23,
                    height: 23,
                  }}
                />
                <Spacer width={CustomSpacing(12)} />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SearchAddress');
                  }}>
                  <VStack>
                    <Text>Pickup</Text>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{
                        maxWidth:
                          Platform.OS == 'ios'
                            ? CustomSpacing(193)
                            : CustomSpacing(226),
                      }}>
                      {homeStore.pickupLocation?.address
                        ? homeStore.pickupLocation?.address
                        : 'input your location'}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              </HStack>
              <HStack>
                <VStack
                  style={{
                    // position: 'absolute',
                    width: 2,
                    height: CustomSpacing(32),
                    backgroundColor: '#9EA2A7',
                    borderStyle: 'dotted',
                    borderWidth: 0,
                    marginLeft: CustomSpacing(10),
                  }}
                />
                <Dash
                  dashThickness={1}
                  dashLength={15}
                  dashColor={'#9EA2A7'}
                  style={{
                    flex: 1,
                    margin: CustomSpacing(8),
                    // marginLeft: CustomSpacing(12),
                  }}
                />
                <TouchableOpacity>
                  <FastImage
                    source={Revers}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                </TouchableOpacity>
              </HStack>

              <HStack>
                <FastImage
                  source={DropOff}
                  style={{
                    width: 23,
                    height: 23,
                  }}
                />
                <Spacer width={CustomSpacing(12)} />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SearchAddress');
                  }}>
                  <VStack>
                    <Text>Drop Off</Text>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{
                        maxWidth:
                          Platform.OS == 'ios'
                            ? CustomSpacing(193)
                            : CustomSpacing(226),
                      }}>
                      {homeStore.destinationLocation?.address
                        ? homeStore.destinationLocation?.address
                        : 'input your drop off'}
                    </Text>
                  </VStack>
                </TouchableOpacity>
              </HStack>
            </VStack>
          </VStack>
        </Animatable.View>
      ) : newTrip && stepNewTrip < 5 && !haveDriver ? (
        <Animatable.View
          style={{
            alignSelf: 'center',
            width: screenWidth,
            height: CustomSpacing(132),
            zIndex: 1001,
            position: 'absolute',
            backgroundColor: '#fff',
            borderBottomRightRadius: CustomSpacing(42),
            borderBottomLeftRadius: CustomSpacing(42),
          }}
          animation="bounceInDown"
          delay={50}>
          <VStack
            style={{
              padding: CustomSpacing(32),
            }}>
            <HStack
              style={{
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  fontSize: 23,
                }}>
                {stepNewTrip == 1
                  ? 'Create Trip'
                  : stepNewTrip == 2
                  ? 'Choose a Trip'
                  : stepNewTrip == 3
                  ? 'Payment Method'
                  : stepNewTrip == 4
                  ? 'Ride Confirmed'
                  : ''}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setNewTrip(false);
                  setStepNewTrip(0);
                }}>
                <FastImage
                  source={BlackClose}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
              </TouchableOpacity>
            </HStack>

            <Spacer height={CustomSpacing(23)} />
            <VStack>
              <HStack style={{justifyContent: 'space-around'}}>
                <VStack
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    width: CustomSpacing(32),
                    height: CustomSpacing(32),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: stepNewTrip >= 1 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip >= 1 ? '#2DBB54' : '#000000',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip >= 1 ? '#fff' : '#000000',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    1
                  </Text>
                </VStack>
                <Dash
                  dashThickness={2}
                  dashLength={15}
                  dashColor={'#9EA2A7'}
                  style={{flex: 1}}
                />
                <VStack
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    width: CustomSpacing(32),
                    height: CustomSpacing(32),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: stepNewTrip >= 2 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip >= 2 ? '#2DBB54' : '#fff',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip >= 2 ? '#fff' : '#000000',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    2
                  </Text>
                </VStack>
                <Dash
                  dashThickness={2}
                  dashLength={15}
                  dashColor={'#9EA2A7'}
                  style={{flex: 1}}
                />
                <VStack
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    width: CustomSpacing(32),
                    height: CustomSpacing(32),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: stepNewTrip >= 3 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip >= 3 ? '#2DBB54' : '#fff',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip >= 3 ? '#fff' : '#000000',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    3
                  </Text>
                </VStack>
                <Dash
                  dashThickness={2}
                  dashLength={15}
                  dashColor={'#9EA2A7'}
                  style={{flex: 1}}
                />
                <VStack
                  style={{
                    borderRadius: 12,
                    borderWidth: 1,
                    width: CustomSpacing(32),
                    height: CustomSpacing(32),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: stepNewTrip >= 4 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip >= 4 ? '#2DBB54' : '#fff',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip >= 4 ? '#fff' : '#000000',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    4
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <Spacer height={CustomSpacing(23)} />
          </VStack>
        </Animatable.View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setShowSideMenu(true);
          }}
          style={{
            left: CustomSpacing(12),
            zIndex: 1000,
            position: 'absolute',
            margin: CustomSpacing(12),
          }}>
          <HStack
            style={{
              justifyContent: 'space-around',
              left: CustomSpacing(-12),
              zIndex: 1000,
              position: 'absolute',
              backgroundColor: '#fff',
              borderRadius: CustomSpacing(12),
              padding: CustomSpacing(6),
            }}>
            <FastImage
              source={CombineShape}
              style={{
                width: 18,
                height: 18,
              }}
            />
          </HStack>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => {
          getLocation();
        }}
        style={{
          right: CustomSpacing(12),
          zIndex: 1000,
          position: 'absolute',
          margin: CustomSpacing(12),
        }}>
        <HStack
          style={{
            justifyContent: 'space-around',
            right: CustomSpacing(-12),
            zIndex: 1000,
            position: 'absolute',
            backgroundColor: '#fff',
            borderRadius: CustomSpacing(12),
            padding: CustomSpacing(6),
          }}>
          <FastImage
            source={MyLocation}
            style={{
              width: 24,
              height: 24,
            }}
          />
          <Spacer width={CustomSpacing(8)} />
          <Text
            style={{
              color: '#000000',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            Location
          </Text>
        </HStack>
      </TouchableOpacity>
      <MapView
        customMapStyle={styles.mapStyle}
        // onPress={e => {
        //   console.log('eees', e);
        // }}
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
        {/* <Marker
          coordinate={{
            latitude: parseFloat(pickyuqStore.pickupLocation?.lat),
            longitude: parseFloat(pickyuqStore.pickupLocation?.lng),
          }}>
          <VStack>
            <FastImage source={LocationIcon} style={{width: 45, height: 45}} />
          </VStack>
        </Marker> */}
      </MapView>
      <BottomSheetModalProvider>
        <VStack>
          <BottomSheetModal
            enableContentPanningGesture={false}
            keyboardBehavior="fillParent"
            enablePanDownToClose={false}
            ref={bottomSheetRef}
            index={1}
            snapPoints={
              stepNewTrip > 1 && stepNewTrip < 5
                ? snapPointsNewTrip
                : stepNewTrip > 4
                ? snapPointsReview
                : snapPoints
            }
            onChange={handleSheetChanges}>
            {newTrip && stepNewTrip == 0 ? (
              <VStack
                style={{
                  height: '70%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setStepNewTrip(1);
                    setNewTrip(true);
                    handleCreateTrip();
                  }}>
                  <VStack
                    style={{
                      justifyContent: 'center',
                      paddingHorizontal: CustomSpacing(102),
                      alignItems: 'center',
                      height: CustomSpacing(60),
                      backgroundColor: '#000000',
                      borderRadius: 12,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Create Trip
                    </Text>
                  </VStack>
                </TouchableOpacity>

                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : newTrip && stepNewTrip == 1 ? (
              <VStack
                style={{
                  height: '90%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <VStack
                  style={{
                    width: screenWidth,
                    paddingHorizontal: CustomSpacing(12),
                  }}>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Trip
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        CHANGE
                      </Text>
                    </TouchableOpacity>
                  </HStack>

                  {/* Pickup and drop off */}
                  <VStack style={{paddingVertical: CustomSpacing(12)}}>
                    <HStack>
                      <FastImage
                        source={PickUp}
                        style={{
                          width: 23,
                          height: 23,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <TouchableOpacity>
                        <VStack>
                          <Text>Pickup</Text>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 15,
                              maxWidth:
                                Platform.OS == 'ios'
                                  ? CustomSpacing(193)
                                  : CustomSpacing(226),
                            }}>
                            {homeStore.pickupLocation?.address
                              ? homeStore.pickupLocation?.address
                              : 'input your location'}
                          </Text>
                        </VStack>
                      </TouchableOpacity>
                    </HStack>
                    <HStack>
                      <VStack
                        style={{
                          // position: 'absolute',
                          width: 2,
                          height: CustomSpacing(32),
                          backgroundColor: '#9EA2A7',
                          borderStyle: 'dotted',
                          borderWidth: 0,
                          marginLeft: CustomSpacing(10),
                        }}
                      />
                      <Dash
                        dashThickness={1}
                        dashLength={15}
                        dashColor={'#9EA2A7'}
                        style={{
                          flex: 1,
                          margin: CustomSpacing(8),
                          // marginLeft: CustomSpacing(12),
                        }}
                      />
                      <TouchableOpacity>
                        <FastImage
                          source={Revers}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                      </TouchableOpacity>
                    </HStack>

                    <HStack>
                      <FastImage
                        source={DropOff}
                        style={{
                          width: 23,
                          height: 23,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <TouchableOpacity>
                        <VStack>
                          <Text>Drop Off</Text>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 15,
                              maxWidth:
                                Platform.OS == 'ios'
                                  ? CustomSpacing(193)
                                  : CustomSpacing(226),
                            }}>
                            {homeStore.destinationLocation?.address
                              ? homeStore.destinationLocation?.address
                              : 'input your drop off'}
                          </Text>
                        </VStack>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>

                  <Dash
                    dashThickness={1}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{
                      flex: 1,
                      margin: CustomSpacing(8),
                      // marginLeft: CustomSpacing(12),
                    }}
                  />
                  {/* Seat and Time */}

                  <VStack>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Seat and Time
                    </Text>
                    <Spacer height={CustomSpacing(12)} />
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <HStack>
                        <FastImage
                          source={Dot}
                          style={{
                            width: CustomSpacing(12),
                            height: CustomSpacing(12),
                          }}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Need seat
                        </Text>
                      </HStack>
                      <HStack>
                        <TouchableOpacity onPress={() => setMySeat(1)}>
                          <VStack
                            style={{
                              borderRadius: 12,
                              borderWidth: 1,
                              width: CustomSpacing(32),
                              height: CustomSpacing(32),
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor: mySeat == 1 ? '#000000' : '#9EA2A7',
                              backgroundColor: mySeat == 1 ? '#000000' : '#fff',
                            }}>
                            <Text
                              style={{
                                color: mySeat == 1 ? '#fff' : '#000000',
                                fontWeight: 'bold',
                                fontSize: 14,
                              }}>
                              1
                            </Text>
                          </VStack>
                        </TouchableOpacity>
                        <Spacer width={CustomSpacing(8)} />
                        <TouchableOpacity onPress={() => setMySeat(2)}>
                          <VStack
                            style={{
                              borderRadius: 12,
                              borderWidth: 1,
                              width: CustomSpacing(32),
                              height: CustomSpacing(32),
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor: mySeat == 2 ? '#000000' : '#9EA2A7',
                              backgroundColor: mySeat == 2 ? '#000000' : '#fff',
                            }}>
                            <Text
                              style={{
                                color: mySeat == 2 ? '#fff' : '#000000',
                                fontWeight: 'bold',
                                fontSize: 14,
                              }}>
                              2
                            </Text>
                          </VStack>
                        </TouchableOpacity>
                        <Spacer width={CustomSpacing(8)} />
                        <TouchableOpacity onPress={() => setMySeat(3)}>
                          <VStack
                            style={{
                              borderRadius: 12,
                              borderWidth: 1,
                              width: CustomSpacing(32),
                              height: CustomSpacing(32),
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor: mySeat == 3 ? '#000000' : '#9EA2A7',
                              backgroundColor: mySeat == 3 ? '#000000' : '#fff',
                            }}>
                            <Text
                              style={{
                                color: mySeat == 3 ? '#fff' : '#000000',
                                fontWeight: 'bold',
                                fontSize: 14,
                              }}>
                              3
                            </Text>
                          </VStack>
                        </TouchableOpacity>
                      </HStack>
                    </HStack>
                    <Spacer height={CustomSpacing(12)} />
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                      }}>
                      <HStack>
                        <FastImage
                          source={Dot}
                          style={{
                            width: CustomSpacing(12),
                            height: CustomSpacing(12),
                          }}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Schedule Time
                        </Text>
                      </HStack>
                      <HStack>
                        <TouchableOpacity
                          onPress={() => setStatusSchedule('NOW')}>
                          <VStack
                            style={{
                              borderRadius: 12,
                              borderWidth: 1,
                              width: CustomSpacing(32),
                              height: CustomSpacing(32),
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor:
                                statusSchedule == 'NOW' ? '#000000' : '#9EA2A7',
                              backgroundColor:
                                statusSchedule == 'NOW' ? '#000000' : '#fff',
                            }}>
                            <Text
                              style={{
                                color:
                                  statusSchedule == 'NOW' ? '#fff' : '#000000',
                                fontWeight: 'bold',
                                fontSize: 11,
                              }}>
                              NOW
                            </Text>
                          </VStack>
                        </TouchableOpacity>
                        <Spacer width={CustomSpacing(8)} />
                        <TouchableOpacity
                          onPress={() => setStatusSchedule('SCHEDULE')}>
                          <VStack
                            style={{
                              borderRadius: 12,
                              borderWidth: 1,
                              width: CustomSpacing(32),
                              height: CustomSpacing(32),
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderColor:
                                statusSchedule == 'SCHEDULE'
                                  ? '#000000'
                                  : '#9EA2A7',
                              backgroundColor:
                                statusSchedule == 'SCHEDULE'
                                  ? '#000000'
                                  : '#fff',
                            }}>
                            <FastImage
                              source={Clock}
                              style={{
                                width: 18,
                                height: 18,
                              }}
                              tintColor={
                                statusSchedule == 'SCHEDULE'
                                  ? '#fff'
                                  : '#000000'
                              }
                            />
                          </VStack>
                        </TouchableOpacity>
                      </HStack>
                    </HStack>
                  </VStack>
                </VStack>
                <Spacer height={CustomSpacing(12)} />
                <HStack
                  style={{
                    paddingTop: CustomSpacing(23),
                    paddingHorizontal: CustomSpacing(12),
                    width: screenWidth,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setNewTrip(false);
                      setStepNewTrip(stepNewTrip >= 1 ? stepNewTrip - 1 : 0);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(100),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#fff',
                        borderColor: '#9EA2A7',
                        borderWidth: CustomSpacing(1),
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Back
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStepNewTrip(2);
                      setNewTrip(true);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(210),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#000000',
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Continue
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </HStack>
                <Spacer height={CustomSpacing(16)} />
                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : newTrip && stepNewTrip == 2 ? (
              <VStack
                style={{
                  height: '90%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <VStack
                  style={{
                    width: screenWidth,
                    paddingHorizontal: CustomSpacing(12),
                  }}>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Select Options
                    </Text>
                  </HStack>

                  {/* Pickup and drop off */}
                  <VStack style={{paddingVertical: CustomSpacing(12)}}>
                    <HStack style={{justifyContent: 'space-between'}}>
                      <TouchableOpacity onPress={() => setMyOption(1)}>
                        <VStack
                          style={{
                            alignItems: 'center',
                          }}>
                          <VStack
                            style={{
                              backgroundColor: '#F6F6F6',
                              padding: CustomSpacing(12),
                              borderRadius: CustomSpacing(12),
                              borderWidth: 1,
                              borderColor:
                                myOption == 1 ? '#000000' : '#F6F6F6',
                            }}>
                            <FastImage
                              source={maxBike}
                              style={{
                                width: 50,
                                height: 50,
                              }}
                            />
                          </VStack>
                          <Spacer height={CustomSpacing(8)} />
                          <Text
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 18,
                            }}>
                            MaxBike
                          </Text>
                          <Text>1 Seat</Text>
                        </VStack>
                      </TouchableOpacity>
                      <Spacer width={CustomSpacing(8)} />
                      <TouchableOpacity onPress={() => setMyOption(2)}>
                        <VStack
                          style={{
                            alignItems: 'center',
                          }}>
                          <VStack
                            style={{
                              backgroundColor: '#F6F6F6',
                              paddingVertical: CustomSpacing(18),
                              paddingHorizontal: CustomSpacing(6),
                              borderRadius: CustomSpacing(8),
                              borderWidth: 1,
                              borderColor:
                                myOption == 2 ? '#000000' : '#F6F6F6',
                            }}>
                            <FastImage
                              source={maxCar}
                              style={{
                                width: 68,
                                height: 38,
                              }}
                              resizeMode={'cover'}
                            />
                          </VStack>
                          <Spacer height={CustomSpacing(8)} />
                          <Text
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 18,
                            }}>
                            MaxCar
                          </Text>
                          <Text>1-3 Seat</Text>
                        </VStack>
                      </TouchableOpacity>
                      <Spacer width={CustomSpacing(8)} />
                      <TouchableOpacity onPress={() => setMyOption(3)}>
                        <VStack
                          style={{
                            alignItems: 'center',
                          }}>
                          <VStack
                            style={{
                              backgroundColor: '#F6F6F6',
                              paddingVertical: CustomSpacing(18),
                              paddingHorizontal: CustomSpacing(6),
                              borderRadius: CustomSpacing(8),
                              borderWidth: 1,
                              borderColor:
                                myOption == 3 ? '#000000' : '#F6F6F6',
                            }}>
                            <FastImage
                              source={maxBig}
                              style={{
                                width: 68,
                                height: 38,
                              }}
                              resizeMode={'cover'}
                            />
                          </VStack>
                          <Spacer height={CustomSpacing(8)} />
                          <Text
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 18,
                            }}>
                            MaxBig
                          </Text>
                          <Text>1-5 Seat</Text>
                        </VStack>
                      </TouchableOpacity>
                      <Spacer width={CustomSpacing(12)} />
                      <TouchableOpacity onPress={() => setMyOption(4)}>
                        <VStack
                          style={{
                            alignItems: 'center',
                          }}>
                          <VStack
                            style={{
                              backgroundColor: '#F6F6F6',
                              paddingVertical: CustomSpacing(18),
                              paddingHorizontal: CustomSpacing(6),
                              borderRadius: CustomSpacing(8),
                              borderWidth: 1,
                              borderColor:
                                myOption == 4 ? '#000000' : '#F6F6F6',
                            }}>
                            <FastImage
                              source={maxTruk}
                              style={{
                                width: 68,
                                height: 38,
                              }}
                              resizeMode={'cover'}
                            />
                          </VStack>
                          <Spacer height={CustomSpacing(8)} />
                          <Text
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 18,
                            }}>
                            MaxTruk
                          </Text>
                          <Text>1-10 Seat</Text>
                        </VStack>
                      </TouchableOpacity>
                      <Spacer width={CustomSpacing(12)} />
                    </HStack>
                  </VStack>
                  <Dash
                    dashThickness={0.9}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{
                      flex: 1,
                      margin: CustomSpacing(8),
                      // marginLeft: CustomSpacing(12),
                    }}
                  />
                  <Spacer height={CustomSpacing(12)} />
                  <VStack>
                    <HStack
                      style={{
                        justifyContent: 'space-between',
                        paddingHorizontal: CustomSpacing(8),
                      }}>
                      <HStack>
                        <FastImage
                          source={mapGrey}
                          style={{
                            width: 24,
                            height: 24,
                          }}
                          resizeMode={'cover'}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}>
                          45 Km
                        </Text>
                      </HStack>

                      <HStack>
                        <FastImage
                          source={clockGrey}
                          style={{
                            width: 24,
                            height: 24,
                          }}
                          resizeMode={'cover'}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}>
                          15 min
                        </Text>
                      </HStack>

                      <HStack>
                        <FastImage
                          source={dollarGrey}
                          style={{
                            width: 24,
                            height: 24,
                          }}
                          resizeMode={'cover'}
                        />
                        <Spacer width={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 15,
                          }}>
                          $ 146.50
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                  <Spacer height={CustomSpacing(12)} />
                  <Dash
                    dashThickness={0.9}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{
                      flex: 1,
                      margin: CustomSpacing(8),
                      // marginLeft: CustomSpacing(12),
                    }}
                  />

                  {/* Pickup and drop off */}
                  <VStack style={{paddingVertical: CustomSpacing(8)}}>
                    <HStack>
                      <FastImage
                        source={PickUp}
                        style={{
                          width: 23,
                          height: 23,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <TouchableOpacity>
                        <VStack>
                          <Text>Pickup</Text>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 15,
                              maxWidth:
                                Platform.OS == 'ios'
                                  ? CustomSpacing(193)
                                  : CustomSpacing(226),
                            }}>
                            {homeStore.pickupLocation?.address
                              ? homeStore.pickupLocation?.address
                              : 'input your location'}
                          </Text>
                        </VStack>
                      </TouchableOpacity>
                    </HStack>
                    <HStack>
                      <VStack
                        style={{
                          // position: 'absolute',
                          width: 2,
                          height: CustomSpacing(23),
                          backgroundColor: '#9EA2A7',
                          borderStyle: 'dotted',
                          borderWidth: 0,
                          marginLeft: CustomSpacing(10),
                        }}
                      />
                      <Dash
                        dashThickness={1}
                        dashLength={15}
                        dashColor={'#9EA2A7'}
                        style={{
                          flex: 1,
                          margin: CustomSpacing(8),
                          // marginLeft: CustomSpacing(12),
                        }}
                      />
                      <TouchableOpacity>
                        <FastImage
                          source={Revers}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                    </HStack>

                    <HStack>
                      <FastImage
                        source={DropOff}
                        style={{
                          width: 23,
                          height: 23,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <TouchableOpacity>
                        <VStack>
                          <Text>Drop Off</Text>
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{
                              color: '#000000',
                              fontWeight: 'bold',
                              fontSize: 15,
                              maxWidth:
                                Platform.OS == 'ios'
                                  ? CustomSpacing(193)
                                  : CustomSpacing(226),
                            }}>
                            {homeStore.destinationLocation?.address
                              ? homeStore.destinationLocation?.address
                              : 'input your drop off'}
                          </Text>
                        </VStack>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                </VStack>

                <HStack
                  style={{
                    paddingTop: CustomSpacing(8),
                    paddingHorizontal: CustomSpacing(12),
                    width: screenWidth,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setNewTrip(true);
                      setStepNewTrip(stepNewTrip >= 1 ? stepNewTrip - 1 : 0);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(100),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#fff',
                        borderColor: '#9EA2A7',
                        borderWidth: CustomSpacing(1),
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Back
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStepNewTrip(3);
                      setNewTrip(true);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(210),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#000000',
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Continue
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </HStack>
                <Spacer height={CustomSpacing(16)} />
                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : newTrip && stepNewTrip == 3 ? (
              <VStack
                style={{
                  height: '90%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <VStack
                  style={{
                    width: screenWidth,
                    paddingHorizontal: CustomSpacing(12),
                  }}>
                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Selected Payment
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        ADD NEW
                      </Text>
                    </TouchableOpacity>
                  </HStack>

                  <VStack>
                    <Spacer height={CustomSpacing(23)} />
                    <TouchableOpacity onPress={() => setPaymentType(1)}>
                      <HStack
                        style={{
                          justifyContent: 'space-between',
                          padding: CustomSpacing(12),
                          borderColor: paymentType == 1 ? '#000000' : '#9EA2A7',
                          borderRadius: CustomSpacing(8),
                          borderWidth: CustomSpacing(1),
                        }}>
                        <HStack>
                          <FastImage
                            source={ic_cash}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Spacer width={CustomSpacing(8)} />
                          <VStack>
                            <Text
                              style={{
                                color: '#000000',
                                fontWeight: 'bold',
                                fontSize: 18,
                              }}>
                              Cash Payment
                            </Text>
                            <Text
                              style={{
                                color: '#9EA2A7',
                                fontWeight: 'bold',
                                fontSize: 12,
                              }}>
                              Default Method
                            </Text>
                          </VStack>
                        </HStack>

                        <FastImage
                          source={
                            paymentType == 1 ? ic_check : ic_check_disable
                          }
                          style={{
                            width: 32,
                            height: 32,
                          }}
                        />
                      </HStack>
                    </TouchableOpacity>
                    <Spacer height={CustomSpacing(12)} />

                    <TouchableOpacity onPress={() => setPaymentType(2)}>
                      <HStack
                        style={{
                          justifyContent: 'space-between',
                          padding: CustomSpacing(12),
                          borderColor: paymentType == 2 ? '#000000' : '#9EA2A7',
                          borderRadius: CustomSpacing(8),
                          borderWidth: CustomSpacing(1),
                        }}>
                        <HStack>
                          <FastImage
                            source={ic_cash}
                            style={{
                              width: 50,
                              height: 50,
                            }}
                          />
                          <Spacer width={CustomSpacing(8)} />
                          <VStack>
                            <Text
                              style={{
                                color: '#000000',
                                fontWeight: 'bold',
                                fontSize: 18,
                              }}>
                              Wallet Payment
                            </Text>
                            <Text
                              style={{
                                color: '#9EA2A7',
                                fontWeight: 'bold',
                                fontSize: 12,
                              }}>
                              Your Wallet
                            </Text>
                          </VStack>
                        </HStack>

                        <FastImage
                          source={
                            paymentType == 2 ? ic_check : ic_check_disable
                          }
                          style={{
                            width: 32,
                            height: 32,
                          }}
                          tintColor={'#000000'}
                        />
                      </HStack>
                    </TouchableOpacity>
                  </VStack>
                  <Spacer height={CustomSpacing(18)} />
                  <Dash
                    dashThickness={2}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{flex: 1}}
                  />
                  <Spacer height={CustomSpacing(18)} />
                  <VStack>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Promo Code
                    </Text>
                    <Spacer height={CustomSpacing(12)} />
                    <TouchableOpacity>
                      <HStack
                        style={{
                          justifyContent: 'space-between',
                          padding: CustomSpacing(12),
                          borderColor: '#9EA2A7',
                          borderRadius: CustomSpacing(8),
                          borderWidth: CustomSpacing(2),
                          backgroundColor: '#DCE5E5',
                          borderStyle: 'dotted',
                        }}>
                        <Spacer width={CustomSpacing(12)} />
                        <Text
                          style={{
                            color: '#2DBB54',
                            fontWeight: 'bold',
                            fontSize: 18,
                            alignSelf: 'center',
                          }}>
                          ADD PROMO CODE
                        </Text>
                        <FastImage
                          source={ic_check_disable}
                          style={{
                            width: 32,
                            height: 32,
                          }}
                          tintColor={'#000000'}
                        />
                      </HStack>
                    </TouchableOpacity>
                  </VStack>
                </VStack>

                <HStack
                  style={{
                    paddingTop: CustomSpacing(32),
                    paddingHorizontal: CustomSpacing(12),
                    width: screenWidth,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setNewTrip(true);
                      setStepNewTrip(stepNewTrip >= 1 ? stepNewTrip - 1 : 0);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(100),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#fff',
                        borderColor: '#9EA2A7',
                        borderWidth: CustomSpacing(1),
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Back
                      </Text>
                    </VStack>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setStepNewTrip(4);
                      setNewTrip(true);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(210),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#000000',
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Request a Trip
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </HStack>
                <Spacer height={CustomSpacing(16)} />
                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : newTrip && stepNewTrip == 4 ? (
              <VStack
                style={{
                  height: '90%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                {haveDriver ? (
                  <>
                    <HStack
                      style={{
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          color: '#2DBB54',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        Arrives in 4 min
                      </Text>
                    </HStack>
                    <Spacer height={CustomSpacing(12)} />
                  </>
                ) : null}

                <VStack
                  style={{
                    width: screenWidth,
                    paddingHorizontal: CustomSpacing(12),
                  }}>
                  <HStack style={{justifyContent: 'space-between'}}>
                    <HStack>
                      <FastImage
                        source={profile_default}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <VStack>
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Devin
                        </Text>
                        <Text
                          style={{
                            color: '#9EA2A7',
                            fontSize: 12,
                          }}>
                          Toyota Inova (CSR874-569)
                        </Text>
                      </VStack>
                    </HStack>
                    <HStack
                      style={{
                        padding: CustomSpacing(4),
                        borderRadius: CustomSpacing(23),
                        borderWidth: CustomSpacing(1),
                        borderColor: '#9EA2A7',
                      }}>
                      <FastImage
                        source={ic_star}
                        style={{
                          width: 20,
                          height: 20,
                        }}
                      />
                      <Spacer width={CustomSpacing(8)} />
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 18,
                        }}>
                        4.50
                      </Text>
                    </HStack>
                  </HStack>
                  <Spacer height={CustomSpacing(18)} />
                  <Dash
                    dashThickness={2}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{flex: 1}}
                  />
                  <Spacer height={CustomSpacing(18)} />

                  <HStack
                    style={{
                      justifyContent: 'space-between',
                      paddingHorizontal: CustomSpacing(8),
                    }}>
                    <HStack>
                      <FastImage
                        source={mapGrey}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        resizeMode={'cover'}
                      />
                      <Spacer width={CustomSpacing(8)} />
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        45 Km
                      </Text>
                    </HStack>

                    <HStack>
                      <FastImage
                        source={clockGrey}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        resizeMode={'cover'}
                      />
                      <Spacer width={CustomSpacing(8)} />
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        15 min
                      </Text>
                    </HStack>

                    <HStack>
                      <FastImage
                        source={dollarGrey}
                        style={{
                          width: 24,
                          height: 24,
                        }}
                        resizeMode={'cover'}
                      />
                      <Spacer width={CustomSpacing(8)} />
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        $ 146.50
                      </Text>
                    </HStack>
                  </HStack>
                  <Spacer height={CustomSpacing(18)} />
                  <Dash
                    dashThickness={2}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{flex: 1}}
                  />
                  <Spacer height={CustomSpacing(23)} />

                  <HStack
                    style={{
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 23,
                      }}>
                      Pickup Point
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 15,
                        }}>
                        CHANGE
                      </Text>
                    </TouchableOpacity>
                  </HStack>
                  <Spacer height={CustomSpacing(18)} />
                  <VStack
                    style={{
                      height: CustomSpacing(130),
                    }}>
                    <MapView
                      customMapStyle={styles.mapStyle}
                      // onPress={e => {
                      //   console.log('eees', e);
                      // }}
                      ref={mapRef}
                      initialRegion={{
                        latitude: homeStore.pickupLocation?.lat
                          ? parseFloat(homeStore.pickupLocation?.lat)
                          : 0.1,
                        longitude: homeStore.pickupLocation?.lng
                          ? parseFloat(homeStore.pickupLocation?.lng)
                          : 0.1,
                        latitudeDelta: LATITUDE_DELTA * 0.2,
                        longitudeDelta: LONGITUDE_DELTA * 0.2,
                      }}
                      style={{
                        flex: 1,
                        borderRadius: CustomSpacing(42),
                      }}
                      zoomEnabled={true}
                      showsMyLocationButton={false}
                      showsUserLocation={true}>
                      {/* <Marker
                      coordinate={{
                        latitude: parseFloat(pickyuqStore.pickupLocation?.lat),
                        longitude: parseFloat(pickyuqStore.pickupLocation?.lng),
                      }}>
                      <VStack>
                        <FastImage source={LocationIcon} style={{width: 45, height: 45}} />
                      </VStack>
                    </Marker> */}
                    </MapView>
                  </VStack>
                </VStack>

                <HStack
                  style={{
                    paddingTop: CustomSpacing(32),
                    paddingHorizontal: CustomSpacing(12),
                    width: screenWidth,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(`tel:${'082213953400'}`);
                      // setNewTrip(true);
                      // setStepNewTrip(stepNewTrip >= 1 ? stepNewTrip - 1 : 0);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(100),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#fff',
                        borderColor: '#9EA2A7',
                        borderWidth: CustomSpacing(1),
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Call
                      </Text>
                    </VStack>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setStepNewTrip(0);
                      setNewTrip(false);
                      setHaveDriver(false);
                    }}>
                    <VStack
                      style={{
                        justifyContent: 'center',
                        width: CustomSpacing(210),
                        alignItems: 'center',
                        height: CustomSpacing(50),
                        backgroundColor: '#000000',
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 23,
                        }}>
                        Cancel Request
                      </Text>
                    </VStack>
                  </TouchableOpacity>
                </HStack>
                <Spacer height={CustomSpacing(16)} />
                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : newTrip && stepNewTrip == 5 ? (
              <VStack
                style={{
                  height: '90%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <VStack
                  style={{
                    width: screenWidth,
                    paddingHorizontal: CustomSpacing(12),
                  }}>
                  <HStack style={{justifyContent: 'space-between'}}>
                    <HStack>
                      <FastImage
                        source={profile_default}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <VStack>
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Devin
                        </Text>
                        <Text
                          style={{
                            color: '#9EA2A7',
                            fontSize: 12,
                          }}>
                          Toyota Inova (CSR874-569)
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                  <Spacer height={CustomSpacing(64)} />

                  <Dash
                    dashThickness={2}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{flex: 1}}
                  />
                  <Spacer height={CustomSpacing(23)} />
                  <VStack style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      How was your trip?
                    </Text>
                    <Spacer height={CustomSpacing(8)} />
                    <Text
                      style={{
                        color: '#9EA2A7',
                        fontSize: 12,
                      }}>
                      Your feedback will help improve driving experience
                    </Text>
                  </VStack>
                  <Spacer height={CustomSpacing(18)} />
                  <VStack>
                    <Rating
                      type="custom"
                      defaultRating={star}
                      startingValue={star}
                      ratingColor="#2DBB54"
                      ratingCount={5}
                      imageSize={35}
                      onFinishRating={async a => {
                        setStar(a);
                      }}
                      style={{
                        paddingVertical: 10,
                      }}
                    />
                  </VStack>
                  <Spacer height={CustomSpacing(32)} />
                  <VStack
                    style={{
                      backgroundColor: '#D9DDDC',
                      padding: CustomSpacing(5),
                      borderRadius: CustomSpacing(12),
                    }}>
                    <TextInput
                      style={{
                        height: CustomSpacing(80),
                      }}
                      underlineColorAndroid="transparent"
                      placeholder="Additional comments..."
                      placeholderTextColor="grey"
                      numberOfLines={5}
                      multiline={true}
                    />
                  </VStack>
                  <Spacer height={CustomSpacing(112)} />
                  <HStack
                    style={{
                      paddingTop: CustomSpacing(23),
                      justifyContent: 'center',
                      flex: 1,
                      // width: screenWidth,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setStepNewTrip(6);
                        setNewTrip(true);
                        setHaveDriver(true);
                      }}>
                      <VStack
                        style={{
                          paddingHorizontal: CustomSpacing(12),
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: CustomSpacing(50),
                          backgroundColor: '#000000',
                          borderRadius: 12,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 23,
                          }}>
                          Submit Feedback
                        </Text>
                      </VStack>
                    </TouchableOpacity>
                  </HStack>
                </VStack>
                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : newTrip && stepNewTrip == 6 ? (
              <VStack
                style={{
                  height: '90%',
                  width: screenWidth,
                  backgroundColor: '#ffffff',
                  padding: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <VStack
                  style={{
                    width: screenWidth,
                    paddingHorizontal: CustomSpacing(12),
                  }}>
                  <HStack style={{justifyContent: 'space-between'}}>
                    <HStack>
                      <FastImage
                        source={profile_default}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                      />
                      <Spacer width={CustomSpacing(12)} />
                      <VStack>
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          Devin
                        </Text>
                        <Text
                          style={{
                            color: '#9EA2A7',
                            fontSize: 12,
                          }}>
                          Toyota Inova (CSR874-569)
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                  <Spacer height={CustomSpacing(64)} />
                  <Dash
                    dashThickness={2}
                    dashLength={15}
                    dashColor={'#9EA2A7'}
                    style={{flex: 1}}
                  />
                  <Spacer height={CustomSpacing(23)} />
                  <VStack style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#000000',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      {`Wow you got ${star} Star!`}
                    </Text>
                    <Spacer height={CustomSpacing(8)} />
                    <Text
                      style={{
                        color: '#9EA2A7',
                        fontSize: 12,
                      }}>
                      Do you want to any additional tip for Devin?
                    </Text>
                  </VStack>
                  <Spacer height={CustomSpacing(32)} />
                  <VStack>
                    <HStack style={{justifyContent: 'space-between'}}>
                      <TouchableOpacity onPress={() => setTip(1)}>
                        <VStack
                          style={{
                            backgroundColor: tip == 1 ? '#000000' : '#ffffff',
                            borderWidth: CustomSpacing(2),
                            borderColor: '#9EA2A7',
                            borderRadius: CustomSpacing(23),
                            padding: CustomSpacing(23),
                            paddingHorizontal: CustomSpacing(25),
                          }}>
                          <Text
                            style={{
                              color: tip == 1 ? '#ffffff' : '#000000',
                              fontWeight: 'bold',
                              fontSize: 32,
                            }}>
                            $1
                          </Text>
                        </VStack>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setTip(2)}>
                        <VStack
                          style={{
                            backgroundColor: tip == 2 ? '#000000' : '#ffffff',
                            borderWidth: CustomSpacing(2),
                            borderColor: '#9EA2A7',
                            borderRadius: CustomSpacing(23),
                            padding: CustomSpacing(23),
                            paddingHorizontal: CustomSpacing(25),
                          }}>
                          <Text
                            style={{
                              color: tip == 2 ? '#ffffff' : '#000000',
                              fontWeight: 'bold',
                              fontSize: 32,
                            }}>
                            $2
                          </Text>
                        </VStack>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setTip(3)}>
                        <VStack
                          style={{
                            backgroundColor: tip == 3 ? '#000000' : '#ffffff',
                            borderWidth: CustomSpacing(2),
                            borderColor: '#9EA2A7',
                            borderRadius: CustomSpacing(23),
                            padding: CustomSpacing(23),
                            paddingHorizontal: CustomSpacing(25),
                          }}>
                          <Text
                            style={{
                              color: tip == 3 ? '#ffffff' : '#000000',
                              fontWeight: 'bold',
                              fontSize: 32,
                            }}>
                            $5
                          </Text>
                        </VStack>
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                  <Spacer height={CustomSpacing(182)} />
                  <HStack
                    style={{
                      paddingTop: CustomSpacing(23),
                      justifyContent: 'center',
                      flex: 1,
                      // width: screenWidth,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setStepNewTrip(0);
                        setNewTrip(false);
                        setHaveDriver(false);
                        handleCreateFinish();
                      }}>
                      <VStack
                        style={{
                          paddingHorizontal: CustomSpacing(12),
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: CustomSpacing(50),
                          backgroundColor: '#000000',
                          borderRadius: 12,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 23,
                          }}>
                          Pay Tip
                        </Text>
                      </VStack>
                    </TouchableOpacity>
                  </HStack>
                </VStack>
                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            ) : (
              <VStack
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  paddingHorizontal: CustomSpacing(16),
                  paddingTop: CustomSpacing(24),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}>
                <Text>Hello ahmed,</Text>
                <Spacer height={CustomSpacing(8)} />
                <Text
                  style={{
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: 23,
                  }}>
                  Where are you going?
                </Text>
                <Spacer height={CustomSpacing(23)} />
                <HStack>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                      flex: 1,
                      height: CustomSpacing(100),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setNewTrip(true);
                        bottomSheetRef.current?.snapToPosition('16%');
                      }}>
                      <VStack style={{alignItems: 'center'}}>
                        <FastImage
                          source={ic_location}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                        <Spacer height={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          New Trip
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text>Tap for location</Text>
                      </VStack>
                    </TouchableOpacity>
                    <Spacer width={CustomSpacing(12)} />
                    <TouchableOpacity>
                      <VStack style={{alignItems: 'center'}}>
                        <FastImage
                          source={ic_location}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                        <Spacer height={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          New Trip
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text>Tap for location</Text>
                      </VStack>
                    </TouchableOpacity>
                    <Spacer width={CustomSpacing(12)} />
                    <TouchableOpacity>
                      <VStack style={{alignItems: 'center'}}>
                        <FastImage
                          source={ic_location}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                        <Spacer height={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          New Trip
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text>Tap for location</Text>
                      </VStack>
                    </TouchableOpacity>
                    <Spacer width={CustomSpacing(12)} />
                    <TouchableOpacity>
                      <VStack style={{alignItems: 'center'}}>
                        <FastImage
                          source={ic_location}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                        <Spacer height={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          New Trip
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text>Tap for location</Text>
                      </VStack>
                    </TouchableOpacity>
                    <Spacer width={CustomSpacing(12)} />
                    <TouchableOpacity>
                      <VStack style={{alignItems: 'center'}}>
                        <FastImage
                          source={ic_location}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                        <Spacer height={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          New Trip
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text>Tap for location</Text>
                      </VStack>
                    </TouchableOpacity>
                    <Spacer width={CustomSpacing(12)} />
                    <TouchableOpacity>
                      <VStack style={{alignItems: 'center'}}>
                        <FastImage
                          source={ic_location}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                        <Spacer height={CustomSpacing(8)} />
                        <Text
                          style={{
                            color: '#000000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          New Trip
                        </Text>
                        <Spacer height={CustomSpacing(2)} />
                        <Text>Tap for location</Text>
                      </VStack>
                    </TouchableOpacity>
                    <Spacer width={CustomSpacing(12)} />
                  </ScrollView>
                </HStack>

                {Platform.OS === 'ios' && <Spacer height={CustomSpacing(16)} />}
              </VStack>
            )}
          </BottomSheetModal>
        </VStack>
      </BottomSheetModalProvider>
    </VStack>
  );
});

export default home;

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
