import {StyleSheet} from 'react-native';
import {Colors, Fonts, Spacing, CustomSpacing} from '@styles';

const LayoutStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexCenter: {
    alignItems: 'center',
  },
  flexTrailing: {
    alignItems: 'flex-end',
  },
  flexMid: {
    justifyContent: 'center',
  },
  flexBottom: {
    justifyContent: 'flex-end',
  },
  flexCenterMid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexWrapTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  flexFullBetween: {
    justifyContent: 'space-between',
    width: '100%',
  },
  flexFullEven: {
    justifyContent: 'space-evenly',
    width: '100%',
  },
  flexTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  midWidhtFull: {
    maxWidth: '80%',
  },
  widthFull: {
    width: '100%',
  },
  heightFull: {
    height: '100%',
  },
  positionRelative: {
    position: 'relative',
  },
  positionAbsolute: {
    position: 'absolute',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerRegister: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  flexRowJustCenter: {flex: 1, flexDirection: 'row', justifyContent: 'center'},
});

export default LayoutStyles;
