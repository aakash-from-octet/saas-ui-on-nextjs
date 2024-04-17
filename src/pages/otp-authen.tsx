import Verification from '@/Components/Modal/Verification';
import VerifiedSuccess from '@/Components/Modal/VerifiedSuccess';
import useVanityUrl from '@/hooks/vanityURL';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const OtpAuthentication = () => {
    const [addVerificationModal, setAddVerificationModal] = useState(false);
    const [verifiedModal, setVerifiedModal] = useState(false);
    const router = useRouter();
    const vanity = useVanityUrl(); 
    useEffect(() => {
        setAddVerificationModal(true);
    }, []);
    useEffect(() => {
        if (verifiedModal) {
        
            const timer = setTimeout(() => {
                router.push(`${vanity}/signed-successful`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [verifiedModal]);
    const { documentId, signerEmail,file } = router.query;
    console.log(documentId,signerEmail,"otpp")
    return (
        <div className='dark-bg h-100vh'>
            <div className='justify-center'>
                {addVerificationModal && <Verification setVerifiedModal={setVerifiedModal} documentId={documentId}  signerEmail={signerEmail}  file={file}/>}
                {verifiedModal && <VerifiedSuccess />}
            </div>
        </div >
    )
}

export default OtpAuthentication;
