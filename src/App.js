import { useState } from 'react';

import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';

import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import {
  HomePage,

  ProfilePage,
  MyTests,
  MyFav
} from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import FetchUserInfo from './panels/Components/bridgeComponents/FetchUserInfo';
export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOMEPAGE } = useActiveVkuiLocation();
  const [user, setUser] = useState();
  return (
    <>
      <FetchUserInfo setUser={setUser}
      //Загрузка данных о пользователе
      />

      <SplitLayout>
        <SplitCol>
          <View activePanel={activePanel}>

            <ProfilePage id="profilepage" fetchedUser={user} />
            <MyFav id="myfav" fetchedUser={user} />
            <MyTests id="mytests" fetchedUser={user} />

            <HomePage id="homepage" fetchedUser={user} />

          </View>
        </SplitCol>
      </SplitLayout>
    </>
  );
};
