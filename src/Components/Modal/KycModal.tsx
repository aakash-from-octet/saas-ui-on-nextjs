import React, { useState } from 'react';
import { Button, Modal, Image, Form, Input, Tabs } from 'antd';
import { MODAL_CLOSE } from '@/Components/utils/image-constants';
const { TabPane } = Tabs;


const KycModal = ({ textBtn, openedSegment, setAadharVerified, setPanVerified }: { textBtn?: any; openedSegment?: any; setAadharVerified?: any; setPanVerified?: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (e: any) => {
        e.preventDefault();
        console.log('values')
    };
    return (
        <>
            <Button type={textBtn ? 'text' : 'default'} onClick={showModal} className='gray-btn'>Verify</Button>

            <Modal title={<p className='text-16 font-600 text-p'>KYC</p>} width={453} centered open={isModalOpen} footer={null} closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}>
                <div className='p-24 div-col'>
                    <Tabs defaultActiveKey={openedSegment ? openedSegment : '1'} className='auth-tab mb-16 kyc-modal-tab'>
                        <TabPane
                            className='business-info-tabsouter'
                            tab={<p className='text-12 text-gray400'>Aadhar Card</p>}
                            key="1">
                            <Form
                                name="basic"
                                layout="vertical"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                                className='div-col gap-24 aadhar-number-form'
                            >
                                <Form.Item
                                    label="Enter aadhar number"
                                    name="aadhar-number"
                                >
                                    <div className="div-row gap-10">
                                        <Input type='tel' size="large" placeholder="9999" className='modal-input' maxLength={4} />
                                        <Input type='tel' size="large" placeholder="9999" className='modal-input' maxLength={4} />
                                        <Input type='tel' size="large" placeholder="9999" className='modal-input' maxLength={4} />
                                    </div>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane
                            tab={<p className='text-12 text-gray400'>Pan Card</p>}
                            key="2">
                            <Form
                                name="basic"
                                layout="vertical"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Enter Pan number"
                                    name="pan-number"
                                >
                                    <Input size="large" placeholder="e.g. ABS785465C" className='modal-input' />
                                </Form.Item>

                            </Form>
                        </TabPane>
                    </Tabs>
                    <p className='text-12 font-400 text-gray400 mb-40'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has standard</p>
                    <Button size='large' type='primary'>Verify</Button>
                </div>
            </Modal >
        </>
    );
};

export default KycModal;