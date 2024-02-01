import React, {useEffect, useState} from 'react';

import {
  Easing,
  PermissionsAndroid,
  Platform,
  NativeModules,
} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {observer} from 'mobx-react-lite';
import {Splash, VStack} from '@components';
import {
  Signin,
  SigninPhoneNumber,
  SigninPinVerify,
  SigninFinish,
  Home,
  SearchAddress,
  SelectOnMap,
} from '@pages';
import SplashScreen from 'react-native-splash-screen';

const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 100,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 250,
    easing: Easing.linear,
  },
};

const MainNavigator = observer(() => {
  const [splashShow, setSplashShow] = useState(true);

  useEffect(() => {
    SplashScreen.hide();
    if (splashShow) {
      setTimeout(() => {
        setSplashShow(false);
      }, 2000);
    }
  }, []);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: config,
              close: closeConfig,
            },
          }}>
          <>
            {splashShow ? (
              <Stack.Screen name="Splash" component={Splash} />
            ) : (
              <>
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen
                  name="SigninPhoneNumber"
                  component={SigninPhoneNumber}
                />
                <Stack.Screen
                  name="SigninPinVerif"
                  component={SigninPinVerify}
                />
                <Stack.Screen name="SigninFinish" component={SigninFinish} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="SearchAddress" component={SearchAddress} />
                <Stack.Screen name="SelectOnMap" component={SelectOnMap} />
              </>
            )}
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
});

export default MainNavigator;
