import React, {createContext, useContext, useState} from 'react';
import {configure} from 'mobx';
import {persist, create} from 'mobx-persist';
import pino from 'pino';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {RouterStore} from '@route/Router.store';
import {HomeStore} from '@pages/home/Home.store';
// import {ExploreStore} from '@pages/explore/Explore.store';
// import {AuthStore} from '@pages/auth/Auth.store';
// import {HistoryStore} from '@pages/history/History.store';
// import {OrderStore} from '@pages/order/Order.store';
// import {AccountStore} from '@pages/account/Account.store';
// import {PickyuqStore} from '@pages/pickyuq/Pickyuq.store';

const log = pino().child({module: 'HomeStore'});

configure({
  enforceActions: 'never',
});
const hydrate = create({
  storage: AsyncStorage,
});
export class RootStore {
  routerStore = new RouterStore(this);
  homeStore = new HomeStore(this);

  constructor() {
    Promise.all([
      //   hydrate('authStore', this.authStore),
      hydrate('homeStore', this.homeStore),
      hydrate('routerStore', this.routerStore),
    ]).then(e => {
      log.info('HYDRATE SUCCESS');
    });
  }
}
export const RootsStoreContext = createContext(new RootStore());

export const useStores = () => useContext(RootsStoreContext);

export const StoreProvider = ({children}) => {
  const [store] = useState(() => new RootStore());
  return (
    <RootsStoreContext.Provider value={store}>
      {children}
    </RootsStoreContext.Provider>
  );
};
