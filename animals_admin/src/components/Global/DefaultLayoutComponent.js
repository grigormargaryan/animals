import React, {Suspense} from 'react';
import {connect} from 'react-redux';
import bindActionCreators from "redux/src/bindActionCreators";
import {NotificationContainer} from 'react-notifications';
import {Container} from 'reactstrap';
import { Route, Switch} from 'react-router-dom';
import {
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
  AppBreadcrumb
} from '@coreui/react';

import {logoutAction} from '../../actions/auth';
import {isAuthenticated} from '../../reducers';
import navigation from '../../nav';
import routes from '../../routes';
import Loading from '../../utils/Loading';

const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;


const DefaultLayout = (props) => {
  const signOut = (e) => {
    e.preventDefault();
    props.logoutAction();
    props.history.push('/sign-in');
  };

  return (
      <div className="">
        <Loading />
        <AppHeader fixed>
          <Suspense fallback={loading()}>
            <DefaultHeader onLogout={e => signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display={props.appSidebar ? 'lg': ''}>
            <AppSidebarHeader/>
            <AppSidebarForm/>
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...props} />
            </Suspense>
            <AppSidebarFooter/>
            <AppSidebarMinimizer/>
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={loading()}>
                <NotificationContainer/>

                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )}/>
                    ) : (null);
                  })}
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
};

const mapStateToProps = state => ({
  isAuthenticated: isAuthenticated(state),
  appSidebar: state.globals.appSidebar,
});

const mapDispatchToProps = dispatch => bindActionCreators({ logoutAction }, dispatch);

export default connect(
  mapStateToProps, mapDispatchToProps,
)((React.memo(DefaultLayout)));

