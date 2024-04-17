import { Image, Modal } from 'antd';
import React, { useEffect } from 'react'
import { VERIFIED_TICK } from '../utils/image-constants';

const EmailVerifiedSuccess = ({ emailVerifiedSuccess, setEmailVerifiedSuccess }: { emailVerifiedSuccess?: any; setEmailVerifiedSuccess?: any; }) => {
    
    useEffect(() => {
        const timertwo = setTimeout(() => {
            setEmailVerifiedSuccess(false);
        }, 2000);
        return () => clearTimeout(timertwo);
    }, [emailVerifiedSuccess]);


    return (
        <Modal
            title={null}
            width={417}
            maskClosable={true}
            className="m-double-header add-recipient-modal"
            open={emailVerifiedSuccess}
            footer={null}
            closeIcon={null}
        >
            <div className='modal-content-details p-24 border-0'>
                <div className='div-col p-10 gap-8 align-center'>
                    <Image src={VERIFIED_TICK.src} alt="verified" preview={false} className='mb-12' />
                    <p className='text-18 font-600 text-p'>Verified Successfully</p>
                    <p className='text-12 font-400 text-gray400'>Your OTP has been successfully verified</p>
                </div>
            </div>


        </Modal>
    )
}

export default EmailVerifiedSuccess;
