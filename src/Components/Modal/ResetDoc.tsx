import React, { useState } from 'react';
import { Button, Modal, Image, Col, Row, notification } from 'antd';
import { RESET_DOC } from '@/Components/utils/image-constants';
import axios from 'axios';
import { DEV_BASE_URL} from '@/config';
import { useRouter } from 'next/router';


const ResetDoc = ({ setResetDocModal, documentId }: { setResetDocModal?: any; documentId?: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const router = useRouter();
    const handleCancel = () => {
        setIsModalOpen(false);
        setResetDocModal(false);
    };

    const handleOk = async () => {
        // let response = await axios.put(`${DEV_BASE_URL}/document/reset`, {
        //     documentId: documentId,
        //     esigne: "me & others"

        // });

        // if (response.data.success == true) {

        //     notification.success({
        //         message: "Success!",
        //         description: "Document Reset successfully.",
        //         duration: 1,
        //         placement: "bottomRight",
        //     });
        //     setIsModalOpen(false);
        //     setResetDocModal(false);

        //     setTimeout(() => {
        //         window.location.reload();
        //     }, 1000);
        // }
        router.push('/');

    };

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={RESET_DOC.src} preview={false} alt="alert" width={73} height={73} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Reset Document</p>
                    <p>Please not that action will reset your document and take you back to the initial upload page.<br />
                        Are you sure you want to continue?</p>
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

export default ResetDoc;