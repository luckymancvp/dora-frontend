import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../redux/slices/Authentications';
import LoadingAllScreen from '../components/LoadingAllScreen';

const PrivateRoute = ({ Component }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    if (isLoggedIn && !currentUser) {
      dispatch(getProfile());
    }
  }, [currentUser, dispatch, isLoggedIn]);

  if (!isLoggedIn) {
    // not logged in so redirect to login page with the return url
    return <Navigate to='/login' replace />;
  }

  if (!currentUser) {
    return <LoadingAllScreen />;
  }

  // authorized so return component
  return <Component currentUser={currentUser} />;
};

export default PrivateRoute;
