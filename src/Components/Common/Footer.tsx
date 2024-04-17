import React from 'react';
import { Divider, Image } from 'antd';
import { LOGO_SEC } from '@/Components/utils/image-constants';

const Footer = () => {
    return (
        <div className='footer-outer'>
            <Image src={LOGO_SEC.src} preview={false} alt="logo" className='mb-20' />
            <div className='footer-content space-between'>
                <div className='div-row align-center'>
                    <p>Solution</p>
                    <Divider type="vertical" />
                    <p>Features</p>
                    <Divider type="vertical" />
                    <p>Privacy Policy</p>
                    <Divider type="vertical" />
                    <p>About Us</p>
                </div>
                <p>© Copyright  2022-2026 - ElasticSign - All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer