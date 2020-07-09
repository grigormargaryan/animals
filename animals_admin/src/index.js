import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {Router, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import {Provider} from 'react-redux';
import history from './history';
import configureStore from './store';
import {PrivateRoute, PublicRoute} from './middlewares/routeMiddleware';
import FooterComponent from './components/Global/FooterComponent';
import 'react-notifications/lib/notifications.css';
import './App.scss';



async function init() {
  const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
  const DefaultLayout = Loadable({
    loader: () => import('./components/Global/DefaultLayoutComponent'),
    loading
  });

  const SignInContainer = Loadable({
    loader: () => import('./containers/SignInContainer'),
    loading
  });

  const store = await configureStore(history);
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Suspense fallback={loading()}>
          <div className="app">
            <Switch>
              <PublicRoute exact path="/sign-in" name="Sign in" component={SignInContainer}/>
              <PrivateRoute path="/" name="Home" component={DefaultLayout}/>
            </Switch>
            <FooterComponent/>
          </div>
        </Suspense>
      </Router>
    </Provider>, document.getElementById('root'));
}

init();