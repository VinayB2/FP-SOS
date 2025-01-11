import React, { useEffect } from 'react';
import { helix } from 'ldrs';
import './Loader.css'

const Loader = () => {
  useEffect(() => {
    helix.register();
  }, []);

  return (
    <div className='loader'>
      <l-helix size="80" speed="1" color="blue"></l-helix>
    </div>
  );
};

export default Loader;
