import { Modal, Image } from 'antd';
import React, { useEffect } from 'react';
import { RESET_SUCCESS } from '@/Components/utils/image-constants';

const PasswordResetSuccessful = ({ successModal, setSuccessModal }: { successModal?: any; setSuccessModal?: any }) => {

    useEffect(() => {
        setTimeout(() => {
            setSuccessModal(false);
        }, 2000);

    }, []);

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={successModal} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8 p-24'>
                    <Image src={RESET_SUCCESS.src} preview={false} alt="alert" width={207} height={273} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Password Successfully Reset</p>
                    <p className='font-400'>Your password has been reset. Use the new password to log in securely.</p>
                </div>
            </div>

        </Modal >
    )
}

export default PasswordResetSuccessful;
