import React from 'react';
import AsideSpinImage from '../../assets/img/login-bg.png';
import '../../styles/LoginAside.css';


export default function LoginAside() {
    return (
        <div>
            <div className='aside-container'>
                <div className='spinned-image-container'>
                    <img src={AsideSpinImage} alt="Spinned Image" className='spinned-image' />
                </div>
            </div>
        </div>
    )
}
