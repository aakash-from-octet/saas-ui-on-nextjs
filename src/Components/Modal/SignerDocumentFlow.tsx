import React, { useEffect, useState } from 'react';
import { Button, Modal, Image, Row, Col, Checkbox, notification, Spin } from 'antd';
import { MODAL_CLOSE } from '@/Components/utils/image-constants';
import axios from 'axios';
import { DEV_BASE_URL} from '@/config';
import SignerVerified from './SignerVerified';
import OtpInput from 'react-otp-input';
import { useRouter } from 'next/router';

// const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "numeric",
//         minute: "numeric",
//         hour12: true,

//     };
//     return new Intl.DateTimeFormat("en-US", options)?.format(date);
// };
const calculateRemainingDays = (sentDate) => {
    const sentOn = new Date(sentDate);
    const expiryDate = new Date(sentOn);
    expiryDate.setDate(sentOn.getDate() + 15); // Set expiry date 15 days after sentOn
    const today = new Date();
    const remainingTime = expiryDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));
    return remainingDays > 0 ? remainingDays : 0; // Ensure it doesn't go negative
};
const SignerDocumentFlow = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
const[documentId, setDocumentId]=useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [documentDetails, setDocumentDetails] = useState<any>([]);
    const [urlData, seturlData] = useState(null);
    const router = useRouter()
    //  from another modal
    const [isSignerVerified, setIsSignerVerified] = useState(false);
    const [otp, setOtp] = useState('');
const[docid,setdocId]=useState("")
    const handleOk = async () => {
        setIsModalOpen(false);
        // setIsVerifyOtp(true);
        try {
            const response = await axios.put(`${DEV_BASE_URL}/document/verify-signer-otp`, { urlData, otp });
            console.log(response.data);
            if (response.data.success) {
                
                setIsModalOpen(false);
                setIsSignerVerified(true);
            } else {
                notification.error({
                    message: "Error!",
                    description: response.data.message,
                    placement: "bottomRight",
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            notification.error({
                message: "Verification Failed",
                description: "An error occurred while verifying OTP.",
                placement: "bottomRight",
            });
        }
    };
    const handleResendOtp = async () => {
        try {
            console.log(urlData, "urlData")
            const response = await fetch(`${DEV_BASE_URL}/document/resend-otp`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: urlData
                }),
            });
            const data = await response.json();
            if (data.success == true) {
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

    const ModalHeader = () => {
        return (
            <p className='text-p mb-20'>Document Info</p>
        );
    };
 
    useEffect(() => {
        const verifyLinkAndFetchDetails = async () => {
            setIsLoading(true);
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const data = urlParams.get('data');
                seturlData(data);
                const verifyResponse = await axios.get(`${DEV_BASE_URL}/document/verify-signer-url/${data}`);
                if (verifyResponse?.data.success) {
                                     
                     const { otpVerificationCompleted, isSignatureCompleted } = verifyResponse.data;
                    if (!otpVerificationCompleted && !isSignatureCompleted) {
                        const documentIdd=verifyResponse?.data?.documentId
                        setDocumentId(verifyResponse?.data?.documentId)
                         sessionStorage.setItem("documentId",documentId)
                        const payload = { documentId: documentIdd };
                        const detailsResponse = await axios.post(`${DEV_BASE_URL}/document/details`, payload);
                        if (detailsResponse?.data && detailsResponse?.data?.documentSignerDetails) {
                            setDocumentDetails(detailsResponse?.data?.documentSignerDetails);
                        } else {
                            console.log("Unexpected response structure or 'documentSignerDetails' not found", detailsResponse?.data);
                        }
                        setIsModalOpen(true);
                    } else if (otpVerificationCompleted && !isSignatureCompleted) {

                        router.push({
                            pathname: '/me-others-flow',
                            query: { 
                              data: urlData,
                             
                            },
                          });
                    } else if (otpVerificationCompleted && isSignatureCompleted) {

                        router.push({
                            pathname: '/signer-successful-signer-flow',
                            query: { data: urlData },
                        });
                    }
                } else {
                    console.error('Verification failed');
                }
            } catch (error) {
                console.error('Error fetching document details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyLinkAndFetchDetails();
    }, [router]);

    console.log(documentDetails)

    if (isLoading) return <Spin size="large" />;
    const calculateRemainingDays = (expirationDate:any) => {
        const today = new Date();
        const expiration = new Date(expirationDate);
        const differenceInTime = expiration.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    };

    const remainingDays = calculateRemainingDays(documentDetails.documentExpirationDate);

    // Formatting dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('default', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    };
console.log(documentId,"sending doc id")
    return (
        <>
            <Modal centered mask={false} title={<ModalHeader />} maskClosable={true} className="m-double-header add-recipient-modal" open={isModalOpen} footer={null} closeIcon={null}>
                <div className='modal-content-details p-24'>
                    <Row gutter={[40, 16]} justify={'space-between'} className='mb-12'>
                        <Col span={8}> <p className='text-gray text-14 font-500'>Document name</p> </Col>
                        <Col span={16}> <p className='text-p text-14 font-600'>{documentDetails?.
                            documetName}</p> </Col>
                        <Col span={8}> <p className='text-gray text-14 font-500'>Sender</p> </Col>
                        <Col span={16}> <p className='text-p text-14 font-600'>{documentDetails?.documentOwnerEmail}</p> </Col>
                        <Col span={8}> <p className='text-gray text-14 font-500'>Owner name</p> </Col>
                        <Col span={16}> <p className='text-p text-14 font-600'>{documentDetails?.documentOwnerName}</p> </Col>
                        <Col span={8}> <p className='text-gray text-14 font-500'>Sent on</p> </Col>
                        <Col span={16}>
                            <p className='text-p text-14 font-600'>
                            {documentDetails.documentCreatedOn ?
                    formatDate(documentDetails.documentCreatedOn) :
                    (documentDetails && documentDetails.documentSentOn ?
                        formatDate(documentDetails.documentExpirationDate) : 'N/A')}
                {' '} (Expires in {remainingDays >= 0 ? remainingDays : 'N/A'} days)
                            </p>
                        </Col>
                    </Row>
                </div>

                <div className='modal-content-footer'>
                    <p className='text-11 font-400 text-gray mb-10'>Required authentication verification by document owner. Please Verify your identity</p>
                    <div className='div-col gap-16 mb-16'>
                        {/* <p className='form-label'>Enter OTP</p> */}
                        <OtpInput
                            inputStyle="otp-inputs"
                            containerStyle={{ justifyContent: 'space-between', gap: '12px' }}
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => <input {...props} />}
                        />
                        <p className='text-end text-14 font-400 text-gray'>Didn&apos;t Receive? <span className='text-link cursor-pointer' onClick={handleResendOtp}>Resend OTP</span></p>
                    </div>
                    <Button type='primary' size='large' block onClick={handleOk}>
                        Verify Otp
                    </Button>
                </div>

            </Modal>
            {isSignerVerified && <SignerVerified urlData={urlData} documentId={documentId}/>}
        </>
    )
}

export default SignerDocumentFlow;