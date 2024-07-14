import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const PrivateRoute = ({ Component }) => {
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return <Component />;
};

export default PrivateRoute;
