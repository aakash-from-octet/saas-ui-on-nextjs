import React, { useEffect, useState } from 'react';
import { Modal, Image } from 'antd';
import { VERIFIED } from '@/Components/utils/image-constants';
import { useRouter } from 'next/router';




const VerifiedSuccess = ({documentId}:{documentId?:any}) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            router.push({
                pathname: '/signed-successful',
                query: { documentId: documentId }, // Adding the documentId as a query parameter
            });
        }, 3000);
    }, []);
    return (
        <Modal title={null} maskClosable={true} className="m-double-header add-recipient-modal" open={isModalOpen} footer={null} closeIcon={null}>
            <div className='modal-content-details p-24 border-0'>
                <div className='div-col p-10 gap-8 align-center'>
                    <Image src={VERIFIED.src} alt="verified" preview={false} className='mb-12' />
                    <p className='text-18 font-600 text-p'>Verified Successfully</p>
                    <p className='text-12 font-400 text-gray400'>Your identity has been successfully verified</p>
                </div>
            </div>


        </Modal>
    )
}

export default VerifiedSuccess;
