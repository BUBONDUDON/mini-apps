import { ScreenSpinner } from '@vkontakte/vkui';

import { useEffect, useState } from 'react';

import bridge from '@vkontakte/vk-bridge';

import { supabase } from '../../../utils/Server/supabase';

const FetchUserInfo = ({ setUser }) => {
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, [setUser, setPopout]);

  return null;
};

export default FetchUserInfo;
