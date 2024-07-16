import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const PrivateRoute = ({ Component }) => {
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    // not logged in so redirect to login page with the return url
    return <Navigate to='/login' replace />;
  }

  // authorized so return component
  return <Component />;
};

export default PrivateRoute;
