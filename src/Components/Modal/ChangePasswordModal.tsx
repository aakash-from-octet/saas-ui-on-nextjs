import React, { useState } from 'react';
import { Button, Form, Image, Input, Modal, notification } from 'antd';
import { MODAL_CLOSE } from '@/Components/utils/image-constants';
import PasswordChangeSuccessful from './PasswordChangeSuccessful';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';

const ChangePasswordModal = ({ changePswdModal, setChangePswdModal }) => {


    const [currPassword, setCurrPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [changedSuccess, setChangedSuccess] = useState(false);

    const handleCancel = () => {
        setChangePswdModal(false);
    }
    

    const updatePasswordApiCall = async (currentPassword:any, newPassword:any) => {
        const formData = new FormData();
       
        try {
            const token = sessionStorage.getItem("accessToken") || "";
         const body ={

            password:newPassword
         }
            
        
            const response = await axios.put(`${DEV_BASE_URL}/user/update-password`, body, {
                headers: {
                    Authorization: ` ${token}`,
                },
            });
    
            if (response.data.success) {
                setChangedSuccess(true); // Indicate successful password change
                setChangePswdModal(false); // Close the modal
            } else {
                // Handle failure (e.g., show a notification with the error message)
                notification.error({
                    className: 'toast-primary',
                    message: 'Password Update Failed',
                    description: response.data.message || 'An error occurred while updating your password.',
                });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            notification.error({
                message: 'Password Update Failed',
                description: 'An error occurred while updating your password.',
                className: 'toast-primary'
            });
        }
    };
    const onFinish = (values) => {
        console.log('change pswd values are', values);
    
        const { currpassword, password, c_password } = values;
        updatePasswordApiCall(currpassword, password);
    };
    
    const onFinishFailed = (error) => {
        console.log('error is', error);
    };


    const ModalHeader = () => {
        return (
            <div className='div-col gap-6 mb-20'>
                <p className='text-p'>Change Password</p>
                <p className='text-14 font-400 text-gray400 lh-24'>Please choose new password</p>
            </div>
        );
    };
    return (
        <>
            <Modal
                title={<ModalHeader />}
                width={484}
                maskClosable={true}
                className="m-double-header add-recipient-modal"
                open={changePswdModal}
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
                    name="change-password"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <div className="modal-content-details div-col gap-24 modal-max-h">

                        <div className='div-col gap-8'>
                            <p className='text-14 font-600 text-gray'>Current Password</p>
                            <Form.Item

                                name="currpassword"
                                rules={[{ required: true, message: 'Please enter your password.' },
                                {
                                    min: 8,
                                    message: 'Password must be at least 8 characters long.'
                                },
                                () => ({
                                    validator(_, value) {
                                        if (value && value.length >= 8) {
                                            const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/;
                                            if (!pattern.test(value)) {
                                                return Promise.reject(new Error('Password must contain at least one uppercase letter, one number, and one special character.'));
                                            }
                                        }
                                        return Promise.resolve();
                                    }
                                })
                                ]}
                            >
                                <Input.Password
                                    type='password'
                                    placeholder="Enter current password"
                                    value={currPassword}
                                    className='modal-input h-42'
                                    onChange={(e) => {
                                        setCurrPassword(e.target.value)
                                    }
                                    }
                                />
                            </Form.Item>
                        </div>

                        <div className='div-col gap-8'>
                            <p className='text-14 font-600 text-gray'>Create New Password</p>
                            <Form.Item

                                name="password"
                                rules={[{ required: true, message: 'Please enter your password.' },
                                {
                                    min: 8,
                                    message: 'Password must be at least 8 characters long.'
                                },
                                () => ({
                                    validator(_, value) {
                                        if (value && value.length >= 8) {
                                            const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/;
                                            if (!pattern.test(value)) {
                                                return Promise.reject(new Error('Password must contain at least one uppercase letter, one number, and one special character.'));
                                            }
                                        }
                                        return Promise.resolve();
                                    }
                                })
                                ]}
                            >
                                <Input.Password
                                    type='password'
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    className='modal-input h-42'
                                    onChange={(e) => {
                                        setNewPassword(e.target.value)
                                        // setErrorMessage(" ")
                                    }
                                    }
                                />
                            </Form.Item>
                        </div>

                        <div className='div-col gap-8'>
                            <p className='text-14 font-600 text-gray'>Confirm New Password</p>
                            <Form.Item

                                name="c_password"
                                rules={[{ required: true, message: 'Re-enter your password.' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match.'));
                                    },
                                }),]}
                            >
                                <Input.Password
                                    type='password'
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                    }
                                    }
                                    className='modal-input h-42'
                                />
                            </Form.Item>
                        </div>
                    </div>


                    <div className="modal-content-footer">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block >
                                Submit
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <PasswordChangeSuccessful
                changedSuccess={changedSuccess}
                setChangedSuccess={setChangedSuccess}
            />
        </>
    )
}

export default ChangePasswordModal;
