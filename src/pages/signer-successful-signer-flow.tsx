import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Col, Row, Spin } from 'antd';
import NavbarSec from '@/Components/Common/NavbarSec';
import DownloadSectionSec from '@/Components/Common/DownloadSectionSec';
import { DEV_BASE_URL} from '@/config';
import CheckPdf from '../audit-trail-page';
import html2canvas from 'html2canvas';
import { PDFDocument,rgb } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import type { PageLayout } from '@react-pdf-viewer/core';
import axios from 'axios';
import NavbarSigner from '@/Components/Common/NavbarSigner';
import DownloadSectionSignerFlow from '@/Components/Common/DownloadSectionSignerFlow';

const SignedSuccessfulSignersflow = ({ file }: { file?: any }) => {
    const router = useRouter();
    const [pdfFile, setPdfFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const[documentid,setdocumentid]=useState<any>(null)
    // const documentId: any = sessionStorage.getItem('documentId') || "";
    const [documentDetails, setDocumentDetails] = useState(null);
const[urlData,seturlData]=useState<any>(null)
    
    useEffect(() => {
        const verifyLinkAndFetchDetails = async () => {
            setIsLoading(true);
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const data = urlParams.get('data');
                seturlData(data)
                const verifyResponse = await axios.get(`${DEV_BASE_URL}/document/verify-signer-url/${data}`);
                if (verifyResponse?.data.otpVerificationCompleted && verifyResponse?.data.isSignatureCompleted) {
                    const documentId = verifyResponse?.data?.documentId;
                    setdocumentid(documentId)
                
                    try {
                        const token = sessionStorage.getItem("accessToken") || "";
                        const requestBody={
                            documentId:documentId
                        }
                       
                        const response = await axios.post(`${DEV_BASE_URL}/document`, requestBody, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `${token}`,
                            },
                        });
                        if (response.data.success) {
        
           
                            const pdfUrl = response.data?.documentUrl;
                            setPdfFile(pdfUrl)
                           
                        }  else {
                            setError('Failed to load PDF file.');
                            setIsLoading(false);
                        }
                    } catch (error) {
                        console.error("Error fetching PDF:", error);
                        setError('Failed to load PDF file.');
                        setIsLoading(false);
                    } finally {
                        setIsLoading(false);
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
    }, []);

    console.log(pdfFile,"pdfFile")


    
    const pageLayout: PageLayout = {
        transformSize: ({ size }) => ({
            height: size.height + 50,
            width: size.width + 50,
        }),
    };

    return (
        <div>
         <NavbarSec logoOnly={true} finalPage={true} />
            <div className='success-signed-outer'>
                <Row className='bg-light' style={{ minHeight: '90vh' }}>
                    <Col flex="auto">
                        {isLoading ? (
                            <Spin size='large' />
                        ) : error ? (
                            <div>{error}</div>
                        ) : pdfFile ? (
                            <div className="final-view-pdf" id="viewer-container">
                                 <Worker workerUrl="https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js">
                                    <Viewer
                                        fileUrl={pdfFile}
                                        defaultScale={1.4}
                                        pageLayout={pageLayout}
                                    />
                                </Worker>
                                <div >
                                <CheckPdf documentId={documentid} />
                                </div>
                            </div>  
                        ) : (
                            <div>No PDF file specified.</div>
                        )}
                    </Col>
                    <Col flex="410px" className='bg-white'>
                        <div className='download-section-container'>
                            <DownloadSectionSignerFlow documentId={documentid}  />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SignedSuccessfulSignersflow;
