import React, { useEffect, useState } from 'react';
import { Button, Image, Modal } from 'antd';
import { DRAFT_ICON, SIGN_RECEIVED_BG } from '@/Components/utils/image-constants';
import { useRouter } from 'next/router';


const SaveAsDraftModal = ({ isSaveDraft, draft,setIsSaveDraft }: { draft?:any;isSaveDraft?: any; setIsSaveDraft?: any; }) => {

    const handleCancel = () => {
        setIsSaveDraft(false);
    };

    const handleOk = () => {
        draft()
        setIsSaveDraft(false);
    };

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isSaveDraft} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={DRAFT_ICON.src} preview={false} alt="alert" width={67} height={75} />
                </div>
                <div className='text-center alert-modal-details px-2'>
                    <p>Save As Draft</p>
                    <p className='font-400'>Do you want to save this document as a Draft?</p>
                </div>
                <div className='space-between gap-20 alert-modal-footer'>
                    <Button size="large" block className='h-45' onClick={handleCancel}>Cancel</Button>
                    <Button size="large" block type='primary' className='h-45' onClick={handleOk}>Yes, Save</Button>
                </div>
            </div>


        </Modal >
    )
}

export default SaveAsDraftModal;