import React, { useState } from 'react';
import { Button, Modal, Image, Checkbox, Col, Row } from 'antd';
import { ALERTB_LG } from '@/Components/utils/image-constants';


const ContinueManageSignee = ({ setSigneeContinue, setManageSigneeModal }: { setSigneeContinue?: any; setManageSigneeModal?: any; }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCancel = () => {
        setIsModalOpen(false);
        setSigneeContinue(false);
        
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setSigneeContinue(false);
        setManageSigneeModal(false);

    };

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={ALERTB_LG.src} preview={false} alt="alert" width={73} height={73} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Managing Signees</p>
                    <p>By adding new signees your document will be reset. Do you want to continue?</p>
                </div>
            </div>
            <div className='modal-content-footer alert-modal-footer'>
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <Button size='large' block onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button type='primary' block size='large' onClick={handleOk}>
                            Yes
                        </Button>
                    </Col>
                </Row>


            </div>
        </Modal >
    )
}

export default ContinueManageSignee;