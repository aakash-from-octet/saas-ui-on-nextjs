import React, { useEffect, useState } from 'react'
import { LOGO } from '../utils/image-constants'
import { Button, Image } from 'antd'
import Link from 'next/link'
import LegalConsentModal from '../Modal/LegalConsentModal'
import SignatureReceivedModal from '../Modal/SignatureReceivedModal'
import axios from 'axios'
import {  DEV_BASE_URL } from '@/config'

const NavbarSigner = ({ generateAndSetModifiedPdf, modifiedPdf, urlData }: { generateAndSetModifiedPdf?: any; modifiedPdf?: any; urlData?: any }) => {
    const [signerConsentModal, setSignerConsentModal] = useState(false);
    const [signReceivedModal, setSignReceivedModal] = useState(false);
    console.log(modifiedPdf, "navbar")
    useEffect(() => {
        if (typeof generateAndSetModifiedPdf === "function") {
            generateAndSetModifiedPdf();
        }
    }, []);

    const handleFinish = async () => {
        console.log("finish");
        generateAndSetModifiedPdf()
        try {
            console.log("from ")
            const modifiedPdf: any = sessionStorage.getItem("modifiedPdfurl") || "";
            const apiURL = `${DEV_BASE_URL}/document/signer-sign`;
            const formData = new FormData();

            if (modifiedPdf) {
                console.log(modifiedPdf);

                // Fetch the blob from the blob URL
                const response = await fetch(modifiedPdf);
                const blob = await response.blob(); // Convert the response to a blob
                formData.append("file", blob, "document.pdf");
            }

            formData.append("urlData",urlData);

            // Make the API call with Axios
            const axiosResponse = await axios.put(apiURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (axiosResponse.data.success) {
                setSignerConsentModal(true);
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className='navbar-outer'>
            <div className='space-between gap-10'>
                <Link href={'/'}>
                    <Image src={LOGO.src} alt="logo" preview={false} />
                </Link>

                <div>
                    {/* <Link href={'/signed-successful'}> */}
                    <Button type='primary' onClick={handleFinish}>Finish</Button>
                    {/* </Link> */}
                    {signerConsentModal && <LegalConsentModal isSignersFlow={true} setSignerConsentModal={setSignerConsentModal} setSignReceivedModal={setSignReceivedModal} />}
                    {signReceivedModal && <SignatureReceivedModal urlData={urlData} />}

                </div>


            </div>
        </div >
    )
}

export default NavbarSigner;