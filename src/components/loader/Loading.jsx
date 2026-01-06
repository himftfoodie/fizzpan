import React from 'react';
import '../../styles/Loading.css';
import LoaderImg  from '../../assets/loading-loading-forever.gif';

export default function Loading() {
  return (
    <div className='fp-container' style={{zIndex: 100}}>
        <img src={LoaderImg} alt="Loader" className="fp-loader" />
    </div>
  )
}
