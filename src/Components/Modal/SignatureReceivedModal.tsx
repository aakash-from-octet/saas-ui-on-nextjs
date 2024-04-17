import React, { useEffect, useState } from 'react';
import { Image, Modal } from 'antd';
import { SIGN_RECEIVED_BG } from '@/Components/utils/image-constants';
import { useRouter } from 'next/router';


const SignatureReceivedModal = ({urlData}:{urlData?:any}) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleOk = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        setTimeout(() => {
            if(urlData) {
                // Sending urlData as a query parameter
                router.push({
                    pathname: '/signer-successful-signer-flow',
                    query: { data: urlData }, // Assuming urlData is a string or serializable object
                });
            } else {
                router.push('/signer-successful-signer-flow');
            }
        }, 1000);
    }, [router, urlData]); 

    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8 p-24'>
                    <Image src={SIGN_RECEIVED_BG.src} preview={false} alt="alert" width={207} height={273} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Signature received!</p>
                    <p className='font-400'>You&apos;ll receive a notification to download the document once all signatures are in</p>
                </div>
            </div>

        </Modal >
    )
}

export default SignatureReceivedModal;