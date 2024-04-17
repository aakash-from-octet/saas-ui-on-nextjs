import React, { useEffect, useState } from 'react';
import { Button, Image, Modal } from 'antd';
import { RESET_DOC_2 } from '@/Components/utils/image-constants';
import { useRouter } from 'next/router';


const ClearAllStampsModal = ({ isResetDoc, setIsResetDoc }: { isResetDoc?: any; setIsResetDoc?: any; }) => {

    const handleCancel = () => {
        setIsResetDoc(false);
    };

    const handleOk = () => {
        setIsResetDoc(false);
    };

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isResetDoc} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={RESET_DOC_2.src} preview={false} alt="alert" width={67} height={75} />
                </div>
                <div className='text-center alert-modal-details px-2'>
                    <p>Clear All Stamps</p>
                    <p className='font-400'>Are you sure you want to clear the stamps?</p>
                </div>
                <div className='space-between gap-20 alert-modal-footer'>
                    <Button size="large" block className='h-45' onClick={handleCancel}>Cancel</Button>
                    <Button size="large" block type='primary' className='h-45' onClick={handleOk}>Yes, Clear</Button>
                </div>
            </div>


        </Modal >
    )
}

export default ClearAllStampsModal;