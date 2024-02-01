import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
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
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {CustomSpacing, Fonts, Colors} from '@styles';
import FastImage from 'react-native-fast-image';
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
} from '@assets';
import * as Animatable from 'react-native-animatable';
import Dash from 'react-native-dash';

const {screenWidth, screenHeight} = dimensions;
const LATITUDE_DELTA = 0.009;
const ASPECT_RATIO = screenWidth / screenHeight;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
Geocoder.init('AIzaSyAsI0vNPe8JNzLfI1ltcElk-mRaEOjiv2c');

const home = observer(() => {
  const {homeStore} = useStores();
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['35%', '18%'], []);
  const snapPointsNewTrip = useMemo(() => ['70%', '18%'], []);
  const navigation = useNavigation();
  const [newTrip, setNewTrip] = useState(false);
  const [stepNewTrip, setStepNewTrip] = useState(0);
  const [mySeat, setMySeat] = useState(0);
  const [statusSchedule, setStatusSchedule] = useState('NOW');

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleCreateTrip = useCallback(() => {
    console.log('reffocusss=>>>>>>', bottomSheetRef);
    bottomSheetRef.current?.snapToPosition('70%');
  }, []);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

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
      })
      .catch(error => console.warn(error));
  };

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('LOCATION', Platform.OS, position);

        getLocConvertAddress(
          position.coords.latitude,
          position.coords.longitude,
        );

        mapRef.current.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA * 0.8,
          longitudeDelta: LONGITUDE_DELTA * 0.8,
        });
      },
      error => {
        console.log('locationManager Error: ', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <VStack style={styles.containerMap}>
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
                <TouchableOpacity>
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
                <TouchableOpacity>
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
      ) : newTrip && stepNewTrip == 1 ? (
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
                Create Trip
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
                    borderColor: stepNewTrip == 1 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip == 1 ? '#2DBB54' : '#000000',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip == 1 ? '#fff' : '#000000',
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
                    borderColor: stepNewTrip == 2 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip == 2 ? '#2DBB54' : '#fff',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip == 2 ? '#fff' : '#000000',
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
                    borderColor: stepNewTrip == 3 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip == 3 ? '#2DBB54' : '#fff',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip == 3 ? '#fff' : '#000000',
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
                    borderColor: stepNewTrip == 4 ? '#2DBB54' : '#000000',
                    backgroundColor: stepNewTrip == 4 ? '#2DBB54' : '#fff',
                  }}>
                  <Text
                    style={{
                      color: stepNewTrip == 4 ? '#fff' : '#000000',
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
          onPress={() => {}}
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
          latitude: parseFloat(homeStore.pickupLocation?.lat),
          longitude: parseFloat(homeStore.pickupLocation?.lng),
          latitudeDelta: LATITUDE_DELTA * 5,
          longitudeDelta: LONGITUDE_DELTA * 5,
        }}
        style={{
          flex: 1,
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
      <BottomSheetModalProvider>
        <VStack>
          <BottomSheetModal
            enablePanDownToClose={false}
            ref={bottomSheetRef}
            index={1}
            snapPoints={stepNewTrip > 0 ? snapPointsNewTrip : snapPoints}
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
                    handleCreateTrip();
                    setNewTrip(true);
                  }}>
                  <VStack
                    style={{
                      justifyContent: 'center',
                      flex: 1,
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
                  <TouchableOpacity>
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
                    <TouchableOpacity onPress={() => setNewTrip(true)}>
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
