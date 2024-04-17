import { Modal, Image } from 'antd';
import React, { useEffect } from 'react';
import { RESET_SUCCESS } from '@/Components/utils/image-constants';

const PasswordChangeSuccessful = ({ changedSuccess, setChangedSuccess }: { changedSuccess?: any; setChangedSuccess?: any; }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            setChangedSuccess(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [changedSuccess]);


    return (
        <Modal
            title={null}
            width={394}
            maskClosable={true}
            className="alert-modal no-header-modal"
            open={changedSuccess}
            footer={null}
            closeIcon={null}
        >
            <div className='alert-modal-content p-0'>
                <div className='alert-modal-img br-8 p-24'>
                    <Image src={RESET_SUCCESS.src} preview={false} alt="alert" width={207} height={273} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Password Successfully Changed</p>
                    <p className='font-400'>Your password has been updated. Use the new password to log in securely.</p>
                </div>
            </div>

        </Modal >
    )
}

export default PasswordChangeSuccessful;
