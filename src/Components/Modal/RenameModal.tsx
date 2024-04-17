import { Modal, Button, Image, Input } from 'antd'
import React, { useState } from 'react';
import { MODAL_CLOSE } from '../utils/image-constants';

const RenameModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <p onClick={() => setIsModalOpen(true)}>Rename</p>
            <Modal
                width={370}
                title={<p className='text-p'>Rename</p>}
                maskClosable={true}
                className="m-double-header add-recipient-modal"
                open={isModalOpen}
                footer={null}
                closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}
            >
                <div className='py-24'>
                    <Input placeholder={'Rename Document'} className='modal-input' />
                </div>
                <div className='modal-content-footer div-row gap-12 justify-end'>
                    <Button type="primary" onClick={handleCancel}>Done</Button>
                </div>

            </Modal>
        </>
    )
}

export default RenameModal;
