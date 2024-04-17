import DownloadSectionSec from '@/Components/Common/DownloadSectionSec';
import NavbarDocDetails from '@/Components/Common/NavbarDocDetails';
import { Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import CheckPdf from './audit-trail-page';
import { PDFDocument, rgb } from 'pdf-lib';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import type { PageLayout } from '@react-pdf-viewer/core';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';


const ProductSignedSuccessful = () => {

    const [docSigned, setDocSigned] = useState();

    let documentId, midifiedPdfurl, fileName: any
    if (typeof window !== 'undefined') {
        documentId = sessionStorage.getItem('ProductdocumentId') || "";
        midifiedPdfurl = sessionStorage.getItem('midifiedPdfurl') || "";
        fileName = sessionStorage.getItem('fileName') || "";

    }

    const [isLoading, setIsLoading] = useState(true);
    const [pdfFile, setPdfFile] = useState(null);
    const error = false;
    const fetchDocumentDetails = async () => {
        try {

            if (!documentId) return;
            const token = sessionStorage.getItem("accessToken") || "";
            const requestBody = {
                documentId: documentId
            }
            const url = `${DEV_BASE_URL}/document`;
            const response = await axios.post(`${DEV_BASE_URL}/document`, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            if (response.data.success) {
                const pdfUrl = response.data?.documentUrl;
                setPdfFile(pdfUrl)

            } else {
                console.error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching document details:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {

        if (documentId) {
            fetchDocumentDetails();
            fetchDocSigned();
        }
    }, [documentId])

    const handleDownloadClick = () => {
        console.log('Downloading file ');
    }

    const pageLayout: PageLayout = {
        transformSize: ({ size }) => ({
            height: size.height + 50,
            width: size.width + 50,
        }),
    };


    const fetchDocSigned = async () => {
        try {
            const payload = { documentId: documentId };
            const response = await axios.post(`${DEV_BASE_URL}/document/details`, payload);
            if (response?.data.success && response?.data.documentSignerDetails) {
                setDocSigned(response?.data.documentSignerDetails.documentStatus as any);
            }
        } catch (error) {
            console.error("Error fetching document details:", error);
        }
    };


    return (
        <div>
            <NavbarDocDetails />
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
                                {docSigned == ('Completed' || 'completed') && (
                                    <div >
                                        <CheckPdf documentId={documentId} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>No PDF file specified.</div>
                        )}
                    </Col>
                    <Col flex="410px" className='bg-white'>
                        <div className='download-section-container'>
                            <DownloadSectionSec documentId={documentId} file={midifiedPdfurl} handleDownloadClick={handleDownloadClick} />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ProductSignedSuccessful;
