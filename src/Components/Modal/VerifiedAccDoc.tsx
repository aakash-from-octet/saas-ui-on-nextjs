import React, { useEffect, useState } from 'react';
import { Button, Modal, Image } from 'antd';
import { VERIFIED_ACC_DOC } from '@/Components/utils/image-constants';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useVanityUrl from '@/hooks/vanityURL';
const VerifiedAccDoc = ({ setIsVerifiedAcc,documentId }: {documentId?:any; setIsVerifiedAcc?: any }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const router = useRouter();
    const vanity = useVanityUrl(); 
    const handleOk = () => {
        setIsModalOpen(false);
        setIsVerifiedAcc(false);
    };
    useEffect(() => {
        setTimeout(() => {
            router.push({
                pathname: `/${vanity}/signed-successful`,
                query: { documentId: documentId }, 
            });
        }, 3000);
    }, []);
    return (
        <Modal title={null} width={394} maskClosable={true} className="alert-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={VERIFIED_ACC_DOC.src} preview={false} alt="alert" width={73} height={73} />
                </div>
                <div className='text-center alert-modal-details'>
                    <p>Verified  Account & <br />Document Sent Successfully</p>
                    <p className='px-2'>Your document has been sent successfully. Please check the email we have shared the tracking URL to keep track on the document.</p>
                </div>
            </div>
            <div className='modal-content-footer alert-modal-footer'>
                <Link href={'/signed-successful'}>
                    <Button type='primary' block size='large' onClick={handleOk}>
                        Ok
                    </Button>
                </Link>
            </div>
        </Modal >
    )
}

export default VerifiedAccDoc;