import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {WelcomeImg, Logo, LogoWhite} from '@assets';
import {CustomSpacing, Fonts, Colors} from '@styles';
import {dimensions} from '@config/Platform.config';
import {VStack, HStack, Spacer, Button} from '@components';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const SigninPinVerify = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [CountryCode, setCountryCode] = useState(62);

  const handleChangeConuntryCode = value => {
    setCountryCode(value?.toString());
  };
  const handleInput = value => {
    setPhoneNumber(value?.toString());
  };
  return (
    <VStack style={styles.loginWithMobile}>
      <ScrollView style={styles.content}>
        <VStack style={[styles.card, styles.bgLayout]}>
          <VStack style={[styles.bg, styles.bgLayout]} />
          <VStack style={styles.logoParent}>
            <VStack style={[styles.logo, styles.logoLayout]}>
              <VStack style={[styles.text, styles.logoLayout]}>
                <Text style={[styles.title, styles.timeTypo1]}>
                  <Text style={styles.taxi}>Taxi</Text>
                  <Text style={styles.mode}>Mode</Text>
                </Text>
                <FastImage
                  source={LogoWhite}
                  style={[styles.textChild, styles.capacityLayout]}
                  resizeMode={'cover'}
                />
              </VStack>
            </VStack>
            <View style={styles.mobileNumberParent}>
              <Text style={styles.mobileNumber}>PIN Verification</Text>
              <Text style={[styles.pleaseEnterYour, styles.byContinueYouTypo]}>
                Enter 6-digit Pin Code. We have sent to at
              </Text>
              <Text
                style={{
                  top: 103,
                  lineHeight: 25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'green',
                  left: 90,
                  width: 319,
                }}>
                +62 895739298878
              </Text>
            </View>
          </VStack>
        </VStack>
        {/* Input Phone */}
        <VStack style={styles.inputConten}>
          <OTPInputView
            // secureTextEntry={true}
            style={{width: '100%', height: 120}}
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={styles.borderStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <VStack style={{alignItems: 'center'}}>
            <HStack>
              <Text>Didn’t receive the code?</Text>
              <TouchableOpacity>
                <Text style={{color: 'green', textDecoration: 'underline'}}>
                  {' '}
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </VStack>
        <VStack style={{paddingTop: CustomSpacing(23), alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate('SigninFinish')}>
            <FastImage
              source={Logo}
              style={{height: CustomSpacing(60), width: CustomSpacing(60)}}
              resizeMode={'cover'}
            />
            <Spacer height={CustomSpacing(32)} />
          </TouchableOpacity>
          <VStack>
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
      </ScrollView>
    </VStack>
  );
};

const styles = StyleSheet.create({
  backgroundPosition: {
    height: 812,
    left: 0,
    top: 0,
    position: 'absolute',
    width: 375,
  },
  bgLayout: {
    height: CustomSpacing(388),
    borderBottomRightRadius: CustomSpacing(85),
    borderBottomLeftRadius: CustomSpacing(85),
  },
  logoLayout: {
    flex: 1,
    position: 'absolute',
  },
  timeTypo1: {
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0,
  },
  capacityLayout: {
    height: CustomSpacing(82),
    width: CustomSpacing(82),
    position: 'absolute',
  },
  byContinueYouTypo: {
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textAlign: 'center',
    position: 'absolute',
  },
  inputPosition: {
    bottom: 196,
    left: 0,
    position: 'absolute',
  },
  parentPosition: {
    bottom: 0,
    position: 'absolute',
  },
  borderBorder: {
    borderWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
  },
  labelTypo: {
    textAlign: 'left',
    lineHeight: 16,
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  textTypo: {
    lineHeight: 24,
    letterSpacing: 0.2,
    // fontSize: FontSize.size_base,
    textAlign: 'left',
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    position: 'absolute',
  },
  india11Layout: {
    height: 24,
    width: 24,
    top: 0,
    position: 'absolute',
    overflow: 'hidden',
  },
  lineLayout: {
    height: 4,
    position: 'absolute',
  },
  timeLayout: {
    width: 54,
    position: 'absolute',
  },
  background: {
    left: 0,
    top: 0,
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  pageBackground: {
    left: 0,
    top: 0,
    position: 'absolute',
  },
  bg: {
    // borderBottomRightRadius: Border.br_66xl,
    // borderBottomLeftRadius: Border.br_66xl,
    backgroundColor: '#000000',
  },
  taxi: {
    color: '#ffffff',
  },
  mode: {
    color: 'green',
  },
  title: {
    top: CustomSpacing(3),
    fontSize: CustomSpacing(26),
    // fontFamily: FontFamily.sFProDisplay,
    textAlign: 'center',
    lineHeight: CustomSpacing(26),
    position: 'absolute',
  },
  textChild: {
    flex: 1,
    left: CustomSpacing(18),
    bottom: CustomSpacing(42),
    position: 'absolute',
  },
  text: {
    flex: 1,
    top: CustomSpacing(90),
    // right: CustomSpacing(23),
  },
  logoIcon: {
    left: 23,
    width: 82,
    height: 82,
    top: 0,
    position: 'absolute',
  },
  logo: {
    left: 97,
    height: 137,
    top: 0,
  },
  mobileNumber: {
    left: 38,
    fontSize: 35,
    fontWeight: '700',
    // fontFamily: FontFamily.robotoBold,
    color: '#ffffff',
    textAlign: 'center',
    top: 0,
    position: 'absolute',
  },
  pleaseEnterYour: {
    top: 67,
    lineHeight: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    // fontSize: FontSize.sFSubheadlineSemibold_size,
    color: '#ffffff',
    left: 0,
    width: 319,
  },
  mobileNumberParent: {
    top: CustomSpacing(142),
    flex: 1,
    position: 'absolute',
  },
  logoParent: {
    top: CustomSpacing(90),
    left: CustomSpacing(28),
    position: 'absolute',
  },
  card: {
    flex: 1,
  },
  dpBorder: {
    // borderColor: Color.gray,
    // borderRadius: Border.br_5xs,
    borderWidth: 1,
    top: 7,
    bottom: 0,
    right: 0,
    left: 0,
  },
  labelCaption: {
    // color: Color.gray,
  },
  dpBorderParent: {
    right: 0,
    left: 0,
    top: 0,
  },
  textData: {
    left: 33,
    color: '#000000',
    top: 0,
  },
  india11: {
    left: 0,
  },
  expandMoreBlack24dp1Icon: {
    left: 76,
  },
  textDataParent: {
    right: 5,
    bottom: 16,
    left: 16,
    top: 23,
    position: 'absolute',
  },
  groupParent: {
    top: -7,
    left: 137,
    right: 0,
  },
  selection: {
    right: 234,
    top: 508,
  },
  dpBorder1: {
    borderColor: 'green',
    borderWidth: 2,
    borderStyle: 'solid',
    // borderRadius: Border.br_5xs,
    top: 7,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
    height: CustomSpacing(32),
  },
  labelCaption1: {
    color: 'green',
  },
  text1: {
    color: '#000000',
  },
  textData1: {
    top: 23,
    left: 20,
    lineHeight: 24,
    letterSpacing: 0.2,
    // fontSize: FontSize.size_base,
  },
  input: {
    right: 0,
    top: 0,
  },
  byContinueYou: {
    // fontSize: FontSize.size_smi,
    color: '#0000000',
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: '500',
    left: 0,
    top: 0,
  },
  termConditions: {
    textDecoration: 'underline',
    color: 'green',
  },
  and: {
    // color: Color.gray,
  },
  termConditionsContainer: {
    lineHeight: 20,
    letterSpacing: 0,
    fontWeight: '500',
  },
  btngoIcon: {
    top: 111,
    left: 138,
    width: 60,
    height: 60,
    position: 'absolute',
  },
  inputParent: {
    right: CustomSpacing(30),
    left: CustomSpacing(-93),
    top: 508,
  },
  content: {
    flex: 1,
  },
  border: {
    right: 2,
    borderRadius: 3,
    borderColor: '#ffffff',
    width: 22,
    opacity: 0.35,
    height: 11,
    top: 0,
  },
  capIcon: {
    top: 4,
    width: 1,
    opacity: 0.4,
    right: 0,
  },
  capacity: {
    top: 2,
    right: 4,
    borderRadius: 1,
    width: 18,
    backgroundColor: '#ffffff',
  },
  battery: {
    top: 17,
    right: 15,
    height: 11,
    width: 24,
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
    marginTop: -3.5,
    top: '50%',
    // fontFamily: FontFamily.nunitoExtraBold,
    // fontSize: FontSize.sFSubheadlineSemibold_size,
    color: '#ffffff',
    left: 0,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 0,
  },
  timeStyle: {
    left: 21,
    height: 21,
    top: 7,
    width: 54,
  },
  header: {
    width: 376,
    height: 44,
    left: 0,
    top: 0,
    position: 'absolute',
  },
  line: {
    marginLeft: -66.5,
    bottom: 8,
    left: '50%',
    // borderRadius: Border.br_81xl,
    width: 134,
    // backgroundColor: Color.black,
  },
  indicator: {
    height: 34,
    right: 0,
    width: 375,
    bottom: 0,
  },
  loginWithMobile: {
    overflow: 'hidden',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inputConten: {
    flex: 1,
    paddingTop: CustomSpacing(2),
    paddingHorizontal: CustomSpacing(24),
  },
  byContinueYouAgreeThatYouParent: {flex: 1},
  byContinueYou: {
    fontSize: 13,
    color: '#3D3D3D',
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textAlign: 'center',
    left: 0,
    top: 0,
  },
  timeFlexBox: {
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0,
  },
  termConditionsContainer: {
    // top: 26,
    fontSize: 14,
    // fontFamily: FontFamily.robotoMedium,
    fontWeight: '500',
    textAlign: 'center',
    // left: 45,
  },
  termConditions: {
    textDecoration: 'underline',
    color: 'green',
  },
  taxi: {
    color: '#ffffff',
  },
  mode: {
    color: 'green',
  },
  borderStyleBase: {
    width: 50,
    height: 60,
    fontSize: 20,
    borderColor: '#000000',
    color: 'green',
    borderRadius: 13,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleHighLighted: {
    borderColor: 'green',
    width: 50,
    height: 60,
    borderWidth: 2,
    fontSize: 20,
  },
});

export default SigninPinVerify;
