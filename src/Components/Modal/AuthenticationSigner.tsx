import React, { useState } from 'react';
import { Button, Form, Modal, Image, Input } from 'antd';
import { MODAL_CLOSE } from '@/Components/utils/image-constants';


const AuthenticationSigner = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedMode, setSelectedMode] = useState<'mobile' | 'email' | 'idle'>('idle');

    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleFormFinish = (value: any) => {
        console.log('form finish', value);
        setIsModalOpen(false);
    }

    const ModalHeader = () => {
        return (
            <div className='div-col gap-6 mb-20'>
                <p className='text-p'>
                    {selectedMode == 'idle' ? 'Authentication' : selectedMode == 'mobile' ? 'Add Authentication via Mobile' : 'Add Authentication via Email'}</p>
                <p className='text-14 font-400 text-gray400 lh-24'>Implement an additional level of authentication to enhance security.</p>
            </div>
        );
    };



    return (
        <Modal width={484} title={<ModalHeader />} maskClosable={true} className="m-double-header add-recipient-modal" open={isModalOpen} footer={null} closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}>
            <Form
                name="signer-authentication-mobile-email"
                onFinish={handleFormFinish}
                onFinishFailed={(errorInfo) => {
                    console.log("Validation failed:", errorInfo);
                }}
            >
                <div className='modal-content-details p-24'>

                    {selectedMode == 'idle' ? (
                        <div className='div-row gap-20'>
                            <Button type='default' size='large' onClick={() => setSelectedMode('mobile')}>Via Mobile</Button>
                            <Button type='default' size='large' onClick={() => setSelectedMode('email')}>Via Email</Button>
                        </div>
                    ) : selectedMode == 'mobile' ? (<div className='div-col gap-8'>
                        <p className='form-label'>Mobile Number</p>
                        <Form.Item
                            name="mobile-number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your mobile number.",
                                },
                                {
                                    len: 10,
                                    message: 'Mobile number should be of 10 digits.'
                                },
                            ]}
                        >
                            <Input
                                type="tel"
                                minLength={10}
                                maxLength={10}
                                placeholder="Enter mobile number"
                                className='modal-input'
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)} />
                        </Form.Item>
                    </div>) : (<div className='div-col gap-8'>
                        <p className='form-label'>Email</p>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email.",
                                },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email.'
                                },
                            ]}
                        >
                            <Input
                                type="email"
                                placeholder="Enter email address"
                                className='modal-input'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </Form.Item>
                    </div>)}
                </div>
                <div className='modal-content-footer justify-center'>
                    <div className='div-col gap-10 w-full justify-center'>
                        {selectedMode != 'idle' && (
                            <Form.Item className='w-full'>
                                <Button type='primary' htmlType="submit" size='large' block>
                                    Submit
                                </Button>
                            </Form.Item>
                        )}
                        <Button type='text' className='auth-skip-btn' size='large' onClick={handleOk}>
                            Skip for Now
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}

export default AuthenticationSigner;