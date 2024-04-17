import { Modal, Button } from 'antd'
import React, { useState } from 'react';


const EditResendModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <p onClick={() => setIsModalOpen(true)}>Edit & Resend</p>
            <Modal width={318} maskClosable={true} className="m-double-header add-recipient-modal" open={isModalOpen} footer={null} closeIcon={null}>
                <div className='mb-8'>
                    <p className='text-16 lh-22 font-600 text-p'>You need to resend the document after editing.</p>
                </div>
                <div className='modal-content-footer div-row gap-12 justify-end'>
                    <Button className='gray-btn' onClick={handleCancel}>cancel</Button>
                    <Button type='primary' onClick={handleCancel}>Continue</Button>
                </div>

            </Modal>
        </>
    )
}

export default EditResendModal