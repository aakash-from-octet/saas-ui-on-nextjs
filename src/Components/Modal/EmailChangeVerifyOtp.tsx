import { Button, Image, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { MODAL_CLOSE } from '../utils/image-constants';
import EmailVerifiedSuccess from './EmailVerifiedSuccess';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';


const EmailChangeVerifyOtp =
    ({ verifyEmailOtp, setVerifyEmailOtp, setEmail, setIsEmailReadOnly, editableEmail, email }:
        { verifyEmailOtp?: any; setVerifyEmailOtp?: any; setEmail?: any; setIsEmailReadOnly?: any; editableEmail?: any; email?: any }) => {

        console.log(email, "email")
        const [emailVerifiedSuccess, setEmailVerifiedSuccess] = useState(false);

        const [otp, setOtp] = useState('');

        const handleOk = async () => {
            const formData = new FormData();
            let body: any = {
                newEmail: email,
                otp: otp
            };
           
            try {
                const token = sessionStorage.getItem("accessToken") || "";
                const response = await axios.put(`${DEV_BASE_URL}/user/update-email`, body, {
                    headers: {
                        Authorization: `${token}`,
                       
                    },
                });
                if (response.data.success) {
                    // Assuming success response handling

                    setVerifyEmailOtp(false);
                    setEmailVerifiedSuccess(true); //this is the email verifies success modal
                    setEmail(editableEmail);
                    setIsEmailReadOnly(true);
                } else {
                    // Handling response indicating verification failure
                    notification.error({
                        message: 'Verification Failed',
                        description: response.data.message || 'Failed to verify email address.',
                        placement: "bottomRight",
                        className: 'toast-primary',
                        duration: 2,
                    });
                }
            } catch (error) {
                setVerifyEmailOtp(false);
                console.error('Error verifying email:', error);
                notification.error({
                    message: 'Verification Error',
                    description: 'An error occurred while verifying the email address.',
                    placement: "bottomRight",
                    className: 'toast-primary',
                    duration: 2,
                });
            }
            finally {
                setOtp('');
            }
        };


        const handleCancel = () => {
            setVerifyEmailOtp(false);
            setOtp('');
        }

        const handleResendOtp = () => {
            console.log('resend otp api');
        }

        const ModalHeader = () => {
            return (
                <div className='div-col gap-6 mb-20'>
                    <p className='text-p'>Verification</p>
                    <p className='text-14 font-400 text-gray400 lh-24'>Please verify the OTP sent to your email address at <br /> {email}.</p>
                </div>
            );
        };

        return (
            <>
                <Modal title={<ModalHeader />} maskClosable={true} className="m-double-header add-recipient-modal" open={verifyEmailOtp} footer={null} closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}>
                    <div className='modal-content-details p-24'>
                        <div className='div-col gap-16'>
                            <p className='form-label'>Enter OTP</p>
                            <OtpInput
                                inputStyle="otp-inputs"
                                containerStyle={{ justifyContent: 'space-between', gap: '12px' }}
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderInput={(props) => <input {...props} />}
                            />
                            <p className='text-end text-14 font-400 text-gray'>Didn’t Received? <span className='text-link cursor-pointer' onClick={handleResendOtp}>Resend OTP</span></p>
                        </div>
                    </div>
                    <div className='modal-content-footer'>
                        <Button type='primary' size='large' block onClick={handleOk}>
                            Submit
                        </Button>
                    </div>
                </Modal>
                <EmailVerifiedSuccess
                    emailVerifiedSuccess={emailVerifiedSuccess}
                    setEmailVerifiedSuccess={setEmailVerifiedSuccess}
                />
            </>
        )
    }

export default EmailChangeVerifyOtp;
