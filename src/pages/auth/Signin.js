import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {WelcomeImg, Logo, PhoneIcon} from '@assets';
import {CustomSpacing, Fonts, Colors} from '@styles';
import {dimensions} from '@config/Platform.config';
import {VStack, HStack, Spacer, Button} from '@components';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Signin = () => {
  const navigation = useNavigation();
  return (
    <VStack>
      <VStack>
        <FastImage
          source={WelcomeImg}
          style={[styles.welcomeImgIcon, styles.contentPosition]}
          resizeMode={'cover'}
        />
        <VStack
          style={{marginTop: CustomSpacing(18), marginLeft: CustomSpacing(18)}}>
          <View style={styles.text}>
            <Text style={[Fonts.textfont, styles.titlePosition]}>
              <Text style={[Fonts.h1, styles.taxi, {fontSize: 30}]}>Max</Text>
              <Text style={[Fonts.h1, styles.mode, {fontSize: 30}]}>Ride</Text>
            </Text>
          </View>
          <FastImage
            source={Logo}
            style={[styles.logoBgBlack, styles.logoLayout]}
            resizeMode={'cover'}
          />
        </VStack>
        <VStack style={styles.groupParent}>
          <VStack style={styles.groupContainer}>
            <VStack style={styles.mobileNumberParent}>
              <Text style={[styles.mobileNumber, styles.titlePosition]}>
                <Text style={styles.taxi}>
                  <Text style={styles.welcomeTo}>{`Welcome to `}</Text>
                  <Text style={styles.taxi1}>Taxi</Text>
                </Text>
                <Text style={styles.taxi1}>
                  <Text style={styles.mode}>Mode</Text>
                </Text>
              </Text>
              {/* <Image
                style={[styles.groupChild, styles.childLayout1]}
                resizeMode="cover"
                source={require('../assets/ellipse-1.png')}
              /> */}
            </VStack>
            <TouchableOpacity
              onPress={() => navigation.navigate('SigninPhoneNumber')}
              style={[
                styles.btncontinuewithphonenumber,
                styles.btncontinuewithphonenumberLayout,
              ]}>
              <View
                style={[
                  styles.btncontinuewithphonenumberChild,
                  styles.childLayout,
                ]}
              />
              <View
                style={[
                  styles.phoneSymbolOfAnAuricularIParent,
                  styles.phoneLayout,
                ]}>
                <FastImage
                  source={PhoneIcon}
                  style={[
                    styles.phoneSymbolOfAnAuricularIIcon,
                    styles.phoneLayout,
                  ]}
                  resizeMode={'cover'}
                />
                <Text style={[styles.continueWithMobile, styles.googleTypo]}>
                  Continue with Mobile Number
                </Text>
              </View>
            </TouchableOpacity>
            <VStack
              style={[
                styles.btngoogleParent,
                styles.btncontinuewithphonenumberLayout,
              ]}></VStack>
          </VStack>
          <VStack style={styles.byContinueYouAgreeThatYouParent}>
            <Text style={[styles.byContinueYou, styles.timeFlexBox]}>
              By continue you agree that you have read and accept our
            </Text>
            <Text style={[styles.termConditionsContainer, styles.timeFlexBox]}>
              <Text style={styles.termConditions}>{`Term & Conditions`}</Text>
              <Text style={styles.taxi}>{` `}</Text>
              <Text style={styles.and}>and</Text>
              <Text style={styles.taxi}>{` `}</Text>
              <Text style={styles.termConditions}>Privacy Policy</Text>
            </Text>
          </VStack>
        </VStack>
      </VStack>
      <VStack></VStack>
    </VStack>
  );
};
const styles = StyleSheet.create({
  welcomeBg: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentPosition: {
    width: dimensions.screenWidth,
    left: 0,
    position: 'absolute',
  },
  logoLayout: {
    height: 37,
    position: 'absolute',
  },
  titlePosition: {
    width: dimensions.screenWidth,
    textAlign: 'left',
    left: 0,
    position: 'absolute',
  },
  childLayout1: {
    height: 7,
    width: 7,
    position: 'absolute',
  },
  btncontinuewithphonenumberLayout: {
    height: 60,
    position: 'absolute',
  },
  childLayout: {
    borderRadius: 8,
    backgroundColor: '#000000',
    left: 0,
  },
  phoneLayout: {
    height: 24,
    position: 'absolute',
  },
  googleTypo: {
    color: '#fff',
    fontSize: 18,
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: 20,
    position: 'absolute',
  },
  btngoogleLayout: {
    width: 153,
    height: 60,
    top: 0,
    position: 'absolute',
  },
  parentLayout: {
    height: 21,
    position: 'absolute',
  },
  capIconLayout: {
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  timeFlexBox: {
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0,
    position: 'absolute',
  },
  headerPosition: {
    right: 0,
    position: 'absolute',
  },
  borderPosition: {
    left: '0%',
    bottom: '0%',
    top: '0%',
    height: '100%',
  },
  background: {
    width: 375,
    left: 0,
    top: 0,
    position: 'absolute',
    height: 812,
  },
  pageBackground: {
    flex: 1,
  },
  welcomeImgIcon: {
    borderBottomRightRadius: 85,
    height: CustomSpacing(362),
    top: 0,
    overflow: 'hidden',
  },
  taxi: {
    color: '#000000',
  },
  mode: {
    color: 'green',
  },
  title: {
    top: 3,
    fontSize: 28,
    // fontFamily: FontFamily.sFProDisplay,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: 'left',
  },
  textChild: {
    left: 45,
    top: 0,
  },
  text: {
    top: 1,
    left: 47,
    width: 126,
    height: 23,
    position: 'absolute',
  },
  logoBgBlack: {
    width: 37,
    left: 0,
    top: 0,
  },
  logo: {
    top: 27,
    width: 173,
    left: 25,
  },
  welcomeTo: {
    fontWeight: '700',
    // fontFamily: FontFamily.robotoBold,
  },
  taxi1: {
    // fontFamily: FontFamily.robotoBlack,
    fontWeight: '800',
  },
  mobileNumber: {
    fontSize: 30,
    top: 0,
  },
  groupChild: {
    top: 4,
    left: 215,
  },
  mobileNumberParent: {
    left: 14,
    width: 299,
    height: 35,
    top: 0,
    // position: 'absolute',
  },
  btncontinuewithphonenumberChild: {
    backgroundColor: '#000000',
    height: 60,
    position: 'absolute',
    width: 326,
    top: 0,
  },
  phoneSymbolOfAnAuricularIIcon: {
    width: 24,
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  continueWithMobile: {
    top: 2,
    left: 38,
  },
  phoneSymbolOfAnAuricularIParent: {
    top: 18,
    left: 24,
    width: 278,
  },
  btncontinuewithphonenumber: {
    top: 65,
    width: dimensions.screenWidth,
    height: 60,
  },
  btngoogleChild: {
    backgroundColor: '#000000',
    borderRadius: 12,
    left: 0,
  },
  google: {
    left: 35,
    top: 0,
  },
  search21: {
    width: 21,
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  googleParent: {
    left: 30,
    width: 93,
    top: 20,
    height: 21,
  },
  btngoogle: {
    left: 0,
  },
  facebook61: {
    width: '18.42%',
    right: '81.58%',
    left: '0%',
    bottom: '0%',
    top: '0%',
    height: '100%',
  },
  facebookParent: {
    left: 20,
    width: 114,
    top: 20,
    height: 21,
  },
  btnfacebook: {
    left: 174,
  },
  btngoogleParent: {
    top: 155,
    width: 327,
    left: 0,
  },
  groupContainer: {
    height: 215,
    width: 327,
    left: 0,
    top: 0,
    position: 'absolute',
  },
  byContinueYou: {
    fontSize: 13,
    color: '#3D3D3D',
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textAlign: 'center',
  },
  termConditions: {
    textDecoration: 'underline',
    color: 'green',
  },
  and: {
    color: '#3D3D3D',
  },
  termConditionsContainer: {
    top: 26,
    fontSize: 14,
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textAlign: 'center',
    left: 45,
  },
  byContinueYouAgreeThatYouParent: {
    top: CustomSpacing(163),
    width: dimensions.screenWidth,
    height: 46,
    position: 'absolute',
  },
  groupParent: {
    top: CustomSpacing(432),
    height: 301,
    width: CustomSpacing(327),
    left: CustomSpacing(25),
    position: 'absolute',
  },
  content: {
    top: 29,
    height: 733,
  },
  border: {
    width: '90.43%',
    right: '9.57%',
    borderRadius: 3,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 1,
    opacity: 0.35,
    position: 'absolute',
  },
  capIcon: {
    height: '35.29%',
    width: '5.46%',
    top: '32.35%',
    right: '0%',
    bottom: '32.35%',
    left: '94.54%',
    opacity: 0.4,
  },
  capacity: {
    height: '64.71%',
    width: '73.99%',
    top: '17.65%',
    right: '17.79%',
    bottom: '17.65%',
    left: '8.22%',
    borderRadius: 1,
    backgroundColor: '#000000',
    position: 'absolute',
  },
  battery: {
    height: '25.76%',
    width: '6.49%',
    top: '39.39%',
    right: '3.82%',
    bottom: '34.85%',
    left: '89.69%',
    position: 'absolute',
  },
  wifiIcon: {
    width: 15,
    height: 11,
  },
  cellularConnectionIcon: {
    width: 17,
    height: 11,
  },
  time: {
    marginTop: -9,
    width: '14.4%',
    top: '50%',
    left: '5.6%',
    // fontSize: FontSize.sFSubheadlineSemibold_size,
    fontWeight: '600',
    // fontFamily: FontFamily.sFSubheadlineSemibold,
    color: '#000000',
  },
  header: {
    height: 44,
    left: 0,
    top: 0,
  },
  line: {
    marginLeft: -66.5,
    bottom: 8,
    left: '50%',
    borderRadius: 100,
    width: 134,
    height: 4,
    backgroundColor: '#000000',
    position: 'absolute',
  },
  indicator: {
    bottom: 0,
    height: 34,
    width: 375,
  },
  welcome: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    height: 812,
  },
});

export default Signin;
