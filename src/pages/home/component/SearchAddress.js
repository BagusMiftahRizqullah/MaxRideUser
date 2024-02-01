import {StyleSheet, TouchableOpacity, Text, TextInput} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {VStack, HStack, Spacer, Button} from '@components';
import {CustomSpacing, Fonts, Colors} from '@styles';
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import Dash from 'react-native-dash';
import {dimensions} from '@config/Platform.config';
import {observer} from 'mobx-react-lite';
import {useStores} from '@store/root.store';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  BlackClose,
  PickUp,
  DropOff,
  Revers,
  ic_location_search,
  ic_destination_search,
  ic_star_search,
} from '@assets';
const {screenWidth, screenHeight} = dimensions;

const SearchAddress = observer(() => {
  const {homeStore} = useStores();
  const navigation = useNavigation();

  return (
    <VStack style={{backgroundColor: '#fff', flex: 1}}>
      <Animatable.View
        style={{
          elevation: CustomSpacing(12),
          alignSelf: 'center',
          width: screenWidth,
          height: CustomSpacing(228),
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
              navigation.goBack();
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

              <VStack>
                <Text>Pickup</Text>
                <TextInput
                  // value={}
                  style={{
                    // backgroundColor: 'red',
                    color: '#000000',
                    maxWidth: CustomSpacing(193),
                  }}
                  // onChangeText={handleChange}
                  placeholder="Input your location"
                />
              </VStack>
            </HStack>
            <HStack>
              <VStack
                style={{
                  top: CustomSpacing(-32),
                  position: 'absolute',
                  width: 3,
                  height: CustomSpacing(94),
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
                  marginHorizontal: CustomSpacing(14),
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
                  zIndex: -10,
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
      <Spacer height={CustomSpacing(32)} />
      <VStack style={{marginHorizontal: CustomSpacing(12)}}>
        <TouchableOpacity
          style={{
            justifyContent: 'space-between',
          }}>
          <HStack>
            <FastImage
              source={ic_star_search}
              style={{
                width: 50,
                height: 50,
              }}
            />
            <Spacer width={CustomSpacing(18)} />
            <Text
              style={{
                color: '#000000',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Saved Places
            </Text>
          </HStack>
        </TouchableOpacity>
        <Spacer height={CustomSpacing(23)} />
        <TouchableOpacity
          onPress={() => navigation.navigate('SelectOnMap')}
          style={{
            justifyContent: 'space-between',
          }}>
          <HStack>
            <FastImage
              source={ic_star_search}
              style={{
                width: 50,
                height: 50,
              }}
            />
            <Spacer width={CustomSpacing(18)} />
            <Text
              style={{
                color: '#000000',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Set Location on map
            </Text>
          </HStack>
        </TouchableOpacity>
        <Spacer height={CustomSpacing(23)} />
        <TouchableOpacity
          style={{
            justifyContent: 'space-between',
          }}>
          <HStack>
            <FastImage
              source={ic_destination_search}
              style={{
                width: 50,
                height: 50,
              }}
            />
            <Spacer width={CustomSpacing(18)} />
            <Text
              style={{
                color: '#000000',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              Enter destination later
            </Text>
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  );
});

export default SearchAddress;

const styles = StyleSheet.create({});
