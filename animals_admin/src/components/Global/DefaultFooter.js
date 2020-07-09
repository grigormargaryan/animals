import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const  DefaultFooter  = () => {
    return (
      <>
      <span className="w-100 text-center">
        LevelHunt &copy; <a href="https://devslaw.com" target="_blank" rel="noopener noreferrer">DevsLaw LLC</a>.
      </span>
      </>
    );
};

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
