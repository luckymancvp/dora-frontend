import React from 'react';
import { Spinner } from "reactstrap";

export const LoadingAllScreen = () => (
  <div className="loading-all-screen">
    <div className='m-auto'>
      <Spinner />
    </div>
  </div>
);

export default LoadingAllScreen;
