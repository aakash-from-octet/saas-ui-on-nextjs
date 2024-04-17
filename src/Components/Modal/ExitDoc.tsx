import React, { useState } from 'react';
import { Button, Modal, Image, Col, Row } from 'antd';
import { EXIT_DOC } from '@/Components/utils/image-constants';
import { useRouter } from 'next/router';


const ExitDoc = ({ setExitDocModal }: { setExitDocModal?: any; }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleCancel = () => {
        setIsModalOpen(false);
        setExitDocModal(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        router.push('/');
        setExitDocModal(false);
    };

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={EXIT_DOC.src} preview={false} alt="alert" width={73} height={73} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Exit Document</p>
                    <p>Are you sure you want to Exit from this document?</p>
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
                            Yes, Exit
                        </Button>
                    </Col>
                </Row>


            </div>
        </Modal >
    )
}

export default ExitDoc;