import React, { useState } from 'react';
import { Button, Modal, Image, Checkbox } from 'antd';
import { LEGAL_CONSENT, SENT_SUCCESS } from '@/Components/utils/image-constants';


const DocSentSuccess = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal width={394} title={null} maskClosable={true} className="consent-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div>
                <Image src={SENT_SUCCESS.src} preview={false} alt="doc-sent" className='img-centered w-full' />
                <div className='p-24 text-center'>
                    <p className='text-18 font-600 text-p mb-12'>Document Sent Successfully</p>
                    <p className='text-14 lh-24 text-gray400'>Your document has been sent successfully. Please check the email we have shared the tracking URL to keep track on the document</p>
                </div>
            </div>
            <div className='modal-content-footer consent-modal-footer'>
                <Button type='primary' size='large' block onClick={handleOk}>
                    Ok
                </Button>
            </div>
        </Modal >
    )
}

export default DocSentSuccess;