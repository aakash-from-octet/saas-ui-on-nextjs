import React, { useEffect, useState } from 'react';
import { Button, Modal, Image, message, notification } from 'antd';
import { MODAL_CLOSE } from '@/Components/utils/image-constants';
import OtpInput from 'react-otp-input';
import { sign } from 'crypto';
import { DEV_BASE_URL} from '@/config';
import VerifiedAccDoc from '@/Components/Modal/VerifiedAccDoc';
import VerifiedSuccess from '@/Components/Modal/VerifiedSuccess';
import { useRouter } from 'next/router';
import useVanityUrl from '@/hooks/vanityURL';
const Verification = ({ documentId, signerEmail, file, setUserVerificationModal }: any) => {
    //change this based on the api results , whether it is single signee ot multiple signee
    const singleSignee = false;
    console.log(file, "downloaadsec")
    const [isModalOpen, setIsModalOpen] = useState(true);
    const vanity = useVanityUrl(); 
    const [isVerifiedAcc, setIsVerifiedAcc] = useState(false);
    const [verifiedModal, setVerifiedModal] = useState(false);
    const router = useRouter()
    const [otp, setOtp] = useState('');
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const ModalHeader = () => {
        return (
            <div className='div-col gap-6 mb-20'>
                <p className='text-p'>Verification</p>
                <p className='text-14 font-400 text-gray400 lh-24'>Please verify the OTP sent to your email address at <br /> {signerEmail}</p>
            </div>
        );
    };
    const handleOk = async () => {
        console.log("no error from here")
        try {
            console.log("inside try block")
            const blobResponse = await fetch(file);
            console.log("inside try block1")
            const blob = await blobResponse.blob();
            console.log("inside try block2")
            const formData = new FormData();
            console.log("inside try block3")
            formData.append('file', blob, 'document.pdf');
            console.log("inside try block4")
            formData.append('documentId', documentId);
            formData.append('signerEmail', signerEmail);
            formData.append('otp', otp);
            console.log("inside try block5")
            const response = await fetch(`${DEV_BASE_URL}/document/send`, {
                method: 'PUT',
                body: formData,
            });
            console.log("inside try block6", response)
            const data = await response.json(); 
            console.log(data,"data from here")
            if (data.success) {
                notification.success({
                    message: "Success!",
                    description: "OTP Verified Successfully ",
                    duration: 1,
                    placement: "bottomRight",
                });
                sessionStorage.setItem('documentId', documentId);

                router.push(`/${vanity}/signed-successful`);
            } else {
                notification.error({
                    message: "error!",
                    description: `${data.message}`,
                    duration: 1,
                    placement: "bottomRight",
                });
            }
        } catch (error) {
            console.log("error form catch")
            console.log('Error during API call:', error);
            notification.error({
                message: "Error!",
                description: "An error occurred during verification.",
                duration: 10,
                placement: "bottomRight",
            });
        }

    };
    
    const handleResendOtp = async () => {
        try {
            const response = await fetch(`${DEV_BASE_URL}/document/initiate-esign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId: documentId,
                    signerEmail: signerEmail,
                }),
            });
            const data = await response.json();
            if (data.status == true) {
                notification.success({
                    message: "Success!",
                    description: "OTP Resent Successfully ",
                    duration: 1,
                    placement: "bottomRight",
                });
            } else {
                notification.error({
                    message: "Error!",
                    description: `${data.message}`,
                    duration: 1,
                    placement: "bottomRight",
                });

            }
        } catch (error) {
            console.error('Error ', error);
        }
    }
    return (
        <>
            <Modal title={<ModalHeader />} maskClosable={true} className="m-double-header add-recipient-modal" open={isModalOpen} footer={null} closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}>
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
            {isVerifiedAcc && <VerifiedAccDoc setIsVerifiedAcc={setIsVerifiedAcc} documentId={documentId} />}
            {verifiedModal && <VerifiedSuccess />}
        </>
    )
}
export default Verification;
