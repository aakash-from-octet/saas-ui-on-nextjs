import NavbarSec from '@/Components/Common/NavbarSec';
import SignerDocumentFlow from '@/Components/Modal/SignerDocumentFlow';
import React, { useEffect, useState } from 'react'

const SignersFlow = () => {
    const [signerDocDetails, setSignerDocDetails] = useState(false);
    useEffect(() => {
        setSignerDocDetails(true)
    }, []);
    return (
        <div className='bg-light h-100vh disable-modalmask-container'>
            <NavbarSec logoOnly={true} finalPage={false} />
            {signerDocDetails && <SignerDocumentFlow />}
        </div>
    )
}

export default SignersFlow;
