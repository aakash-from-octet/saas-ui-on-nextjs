import { Button, Collapse, Form, Image, Input, Modal, notification } from 'antd';
import React, { useState } from 'react'
import { DOWN_ARROW_SM_BLUE, MODAL_CLOSE, UP_ARROW_SM_BLUE } from '../utils/image-constants';
import KycModal from './KycModal';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';

const AddContactModal = ({getContact}:{getContact?:any}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk =async (values: any) => {
        const token = sessionStorage.getItem("accessToken") || "";
        try {
            const response = await axios.post(
                `${DEV_BASE_URL}/contact/create`,
                { ...values },
                {
                  headers: {
                    Authorization: `${token}`, 
                  },
                }
              );
            if (response.data.success) {
                            
                notification.success({
                    message: 'Success!',
                    description: `Contact Successfully Created.`,
                    placement: "bottomRight",
                    className: 'toast-primary',
                    duration: 2,
                });
            } else {
                
                notification.error({
                    message: 'Error!',
                    description: `${response.data.message}`,
                    placement: "bottomRight",
                    className: 'toast-primary',
                    duration: 2,
                });
            }
            getContact()
            setIsModalOpen(false)
         
          } catch (error) {
            console.error('Error adding contact:', error);
            // Handle error state here, such as displaying an error message
          }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const expandIcon = ({ isActive }) => (
        <Image
            src={isActive ? UP_ARROW_SM_BLUE.src : DOWN_ARROW_SM_BLUE.src}
            preview={false}
            className='img-centered ml-n2'
            alt="btn"
        />
    );

    return (
        <>
            <Button type="primary" onClick={showModal}>New Contact</Button>
            <Modal
                width={370}
                centered
                title={<p className="text-p text-18 font-600">New contact</p>}
                open={isModalOpen}
                footer={null}
                closeIcon={
                    <Image
                        src={MODAL_CLOSE.src}
                        preview={false}
                        alt="modal-close"
                        onClick={handleCancel}
                    />
                }>
                <Form
                    name="add_contact_form"
                    className="add-contact-form"
                    initialValues={{ remember: true }}
                    onFinish={handleOk}
                    onFinishFailed={(errorInfo) => {
                        console.log("Validation failed:", errorInfo);
                    }}
                >
                    <div className='mt-20'>
                        <div className='div-col gap-24'>
                            <div className='div-col gap-16'>
                                <div className='div-col gap-8'>
                                    <p className='text-14 font-400 text-gray'>Name</p>
                                    <Form.Item
                                        name="name"
                                        rules={[{ required: true, message: "Enter your name." }]}
                                    >
                                        <Input type="text" placeholder="Enter name" className="modal-input" />
                                    </Form.Item>
                                </div>
                                <div className='div-col gap-8'>
                                    <p className='text-14 font-400 text-gray'>Email Address</p>
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, message: 'Please enter an email address.' },
                                        { type: 'email', message: 'Please enter a valid email address.' }]}
                                    >
                                        <Input type="email" placeholder="Enter email" className="modal-input" />
                                    </Form.Item>
                                </div>
                                <div className='div-col gap-8'>
                                    <p className='text-14 font-400 text-gray'>Phone number</p>
                                    <Form.Item
                                        name="phoneNumber"
                                        rules={[{ required: true, message: 'Please enter a phone number.' },
                                        {
                                            pattern: /^\d{10}$/,
                                            message: 'Please enter a valid 10-digit phone number.'
                                        }]}
                                    >
                                        <Input type="tel" maxLength={10} placeholder="Enter mobile number" className="modal-input" />
                                    </Form.Item>
                                </div>
                                <Collapse
                                    expandIconPosition='right'
                                    className='collapse-addtn-details'
                                    expandIcon={expandIcon}
                                    ghost
                                    items={[
                                        {
                                            key: '1',
                                            label: (<p className='text-12 lh-20 font-500 text-blue'>Additional Detail</p>),
                                            children: <div className='div-col gap-16'>
                                                <div className='div-col gap-8'>
                                                    <p className='text-14 font-400 text-gray'>Company Name</p>
                                                    <Form.Item
                                                        name="company_name"
                                                    >
                                                        <Input type="text" placeholder="Enter company name" className="modal-input" />
                                                    </Form.Item>
                                                </div>
                                                <div className='div-col gap-8'>
                                                    <p className='text-14 font-400 text-gray'>Title</p>
                                                    <Form.Item
                                                        name="company_title"
                                                    >
                                                        <Input type="text" placeholder="Enter designation" className="modal-input" />
                                                    </Form.Item>
                                                </div>
                                                <div className='div-col gap-8'>
                                                    <p className='text-14 font-400 text-gray'>Aadhar Card Number</p>
                                                    <Form.Item
                                                        name="aadhar_number"
                                                    >
                                                        <Input type="tel"
                                                            maxLength={12}
                                                            placeholder="Enter aadhar number"
                                                            suffix={<KycModal textBtn={true} openedSegment={'1'} />}
                                                            className="modal-input" />
                                                    </Form.Item>
                                                </div>
                                                <div className='div-col gap-8'>
                                                    <p className='text-14 font-400 text-gray'>Pancard Number</p>
                                                    <Form.Item
                                                        name="pancard_number"
                                                    >
                                                        <Input type="tel" maxLength={10} placeholder="Enter PAN number" className="modal-input" suffix={<KycModal textBtn={true} openedSegment={'2'} />} />
                                                    </Form.Item>
                                                </div>
                                            </div>,
                                        }
                                    ]} />

                            </div>


                            {/* footer */}
                            <Button type="primary" htmlType="submit" size="large" block >
                                Create
                            </Button>
                        </div>
                    </div>
                </Form>

            </Modal>
        </>
    )
}

export default AddContactModal;
