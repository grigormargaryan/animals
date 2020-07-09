import React from 'react';
import LoadingBar from 'react-redux-loading-bar';

const Loading = () => {
    return (
      <>
         <LoadingBar className="loader"/>
        <LoadingBar className="parent-loader"/>
      </>
    );
};

export default Loading
