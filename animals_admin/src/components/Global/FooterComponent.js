import React, {Suspense} from 'react';
import {
  AppFooter,
} from '@coreui/react';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));

const FooterComponent  = ()  =>  {

  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

    return (
      <AppFooter className="footer-fix">
        <Suspense fallback={loading()}>
          <DefaultFooter/>
        </Suspense>
      </AppFooter>
    );
};

export default React.memo(FooterComponent);
