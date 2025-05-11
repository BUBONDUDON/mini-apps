import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  //Странички основы
  HOMEPAGE: 'homepage',
  //Странички профиля
  PROFILEPAGE: 'profilepage',
  MYTESTS: 'mytests',
  MYFAV: 'myfav'
  //...

};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      //Странички основы
      createPanel(DEFAULT_VIEW_PANELS.HOMEPAGE, `/`, []),
      //Странички профиля
      createPanel(DEFAULT_VIEW_PANELS.PROFILEPAGE, `/${DEFAULT_VIEW_PANELS.PROFILEPAGE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.MYTESTS, `/${DEFAULT_VIEW_PANELS.MYTESTS}`, []),
      createPanel(DEFAULT_VIEW_PANELS.MYFAV, `/${DEFAULT_VIEW_PANELS.MYFAV}`, []),
      //...
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
