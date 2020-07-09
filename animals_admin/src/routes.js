import React from 'react';


const HomeContainer = React.lazy(() => import('./containers/HomeContainer'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: HomeContainer },
];

export default routes;
