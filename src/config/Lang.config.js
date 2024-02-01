// import I18n from 'react-native-i18n';
// import i18next from 'i18next';
// import {initReactI18next} from 'react-i18next';
// import * as RNLocalize from 'react-native-localize';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ExploreLocaleId, ExploreLocaleEn} from '../pages/explore/Explore.lang';
// import {HistoryLocaleId, HistoryLocaleEn} from '../pages/history/History.lang';
// import {AccountLocaleId, AccountLocaleEn} from '@pages/account/Account.lang';
// import {OrderLocaleId, OrderLocaleEn} from '../pages/order/Order.lang';
// import {PickyuqLocaleId, PickyuqLocaleEn} from '../pages/pickyuq/Pickyuq.lang';

// const DEFAULT_LANGUAGE = {languageTag: 'en', isRTL: false};
// const LANGUAGES = {
//   en: {
//     translation: {
//       // AUTH
//       greeting: 'Welcome to Hayuq!',
//       greetingDesc: 'All your favorite food in one place',
//       greetingVariant: 'Variety',
//       greetingVariantDesc:
//         'Over 15.000 choices of delicious food & beverages from our partnered merchants',
//       greetingSafe: 'Safe & Fast Delivery',
//       greetingSafeDesc:
//         '10.000 professional couriers to pick up & deliver your order safely & on-time',
//       login: 'Login',
//       register: 'New to Hayuq? Sign up!',
//       agreement: 'By logging in or registering, you agree to our',
//       tnc: 'Terms of service',
//       privacy: 'Privacy Policy',
//       // OVERLAY
//       titleOverlay1: 'Get Started',
//       welcome: 'Welcome Back',
//       welcomeDesc: 'Enter your phone number to login to your Hayuq account.',
//       welcomeDesc1: 'You will get a whatsapp message from our system.',
//       phoneNumber: 'Phone Number',
//       continue: 'Continue',
//       registeredPhoneNumber: 'Phone number is not registered',
//       name: 'Name',
//       enterName: 'Enter your name',
//       email: 'Email',
//       signup: 'Sign Up',
//       createAccount: 'Create new account',
//       createAccountDesc:
//         'Create your Hayuq account easily using your phone number & email',
//       emailNotValid: 'Email is not valid',
//       referralCode: 'Referral code (optional)',
//       optional: '(optional)',

//       // EXPLORE
//       ...ExploreLocaleEn,
//       // History
//       ...HistoryLocaleEn,
//       ...AccountLocaleEn,
//       ...OrderLocaleEn,
//       ...PickyuqLocaleEn,
//     },
//   },
//   id: {
//     translation: {
//       // AUTH
//       greeting: 'Hai Sahabat, selamat datang di Hayuq!',
//       greetingDesc: 'Satu aplikasi untuk pesan berbagai menu favoritmu',
//       greetingVariant: 'Ragam pilihan menu',
//       greetingVariantDesc:
//         'Lebih dari 15.000 pilihan makanan & minuman dari mitra UMKM lokal kami',
//       greetingSafe: 'Pengantaran Pesanan yang Aman & Cepat',
//       greetingSafeDesc:
//         '10.000 kurir profesional siap antar pesananmu dengan aman & tepat waktu',
//       login: 'Masuk',
//       register: 'Belum punya akun ? Daftar sekarang!',
//       agreement: 'Dengan masuk atau mendaftar, kamu setuju dengan',
//       tnc: 'Ketentuan layanan',
//       privacy: 'Kebijakan Privasi',
//       // OVERLAY
//       titleOverlay1: 'Lanjut',
//       welcome: 'Selamat datang kembali, Sahabat!',
//       welcomeDesc: 'Masukkan nomor teleponmu untuk masuk ke akun Hayuq-mu',
//       welcomeDesc1: 'Kamu akan mendapatkan pesan whatsapp dari sistem kami.',
//       phoneNumber: 'Nomor Telepon',
//       continue: 'Lanjutkan',
//       registeredPhoneNumber: 'Nomor telepon tidak terdaftar',
//       name: 'Nama',
//       enterName: 'Masukkan namamu',
//       email: 'Email',
//       signup: 'Daftar',
//       createAccount: 'Buat akun baru',
//       createAccountDesc: 'Daftar akun Hayuq pakai nomor telepon & email',
//       emailNotValid: 'Email tidak valid',
//       referralCode: 'Kode referral (opsional)',
//       optional: '(opsional)',
//       // Explore
//       ...ExploreLocaleId,
//       // History
//       ...HistoryLocaleId,
//       ...AccountLocaleId,
//       // Order
//       ...OrderLocaleId,
//       ...PickyuqLocaleId,
//     },
//   },
// };

// const LANG_CODES = Object.keys(LANGUAGES);

// const LANGUAGE_DETECTOR = {
//   type: 'languageDetector',
//   async: true,
//   detect: (callback) => {
//     AsyncStorage.getItem('user-language', (err, language) => {
//       // if error fetching stored data or no language was stored
//       // display errors when in DEV mode as console statements
//       if (err || !language) {
//         if (err) {
//           console.log('Error fetching Languages from asyncstorage ', err);
//         } else {
//           console.log('No language is set, choosing English as fallback');
//         }
//         const findBestAvailableLanguage =
//           RNLocalize.findBestAvailableLanguage(LANG_CODES);

//         if (findBestAvailableLanguage) {
//           callback(findBestAvailableLanguage?.languageTag);
//           return;
//         } else {
//           callback(DEFAULT_LANGUAGE.languageTag);
//           return;
//         }
//       }
//       callback(language);
//     });
//   },
//   init: () => {},
//   cacheUserLanguage: (language) => {
//     AsyncStorage.setItem('user-language', language);
//   },
// };

// i18next
//   .use(LANGUAGE_DETECTOR)
//   .use(initReactI18next)
//   .init({
//     compatibilityJSON: 'v3',
//     fallbackLng: 'en',
//     resources: LANGUAGES,
//     react: {
//       useSuspense: false,
//     },
//     interpolation: {
//       escapeValue: false, // not needed for react!!
//     },
//     defaultNS: 'translation',
//   });

// export default i18next;
