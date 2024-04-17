import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Col, Row, Spin, notification } from 'antd';
import NavbarSec from '@/Components/Common/NavbarSec';
import DownloadSectionSec from '@/Components/Common/DownloadSectionSec';
import { DEV_BASE_URL } from '@/config';
import CheckPdf from '../audit-trail-page';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import type { PageLayout } from '@react-pdf-viewer/core';
import axios from 'axios';

const SignedSuccessful = ({ file }: { file?: any }) => {
    const router = useRouter();
    const [pdfFile, setPdfFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [documentDetails, setDocumentDetails] = useState(null);
    const [docSigned, setDocSigned] = useState();
    const [boxforsignees, setBoxforsignees] = useState<any>([]);

    let documentId: any
    if (typeof window !== 'undefined') {
        documentId = sessionStorage.getItem('documentId') || "";
        
    }

    useEffect(() => {
        const fetchPdf = async () => {
            if (!router.isReady) return;
            if (documentId) {
                setIsLoading(true);

                try {
                    const token = sessionStorage.getItem("accessToken") || "";
                    const requestBody={
                        documentId:documentId
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
            }
        };
        fetchPdf();
    }, [documentId, router.isReady]);
    useEffect(() => {
        if (documentId) {
            console.log("function sign");
            const requestBody = {
                documentId: documentId
            };
            const fetchSignDetails = async () => {
                try {
                    const response = await axios.put(`${DEV_BASE_URL}/document/placeholders`, requestBody);
                    const signDetails = response?.data?.message;
                    console.log(signDetails, "placeholders");
    
                    const nonOwnerSignDetails = signDetails?.filter(detail => !detail.isDocumentOwner);
                    console.log(nonOwnerSignDetails, "gg");
                    setBoxforsignees(nonOwnerSignDetails);
                    
                } catch (error) {
                    console.error('Error fetching sign details:', error);
                }
            };
            fetchSignDetails();
        }
    }, [documentId]);
    useEffect(() => {
        if (!router.isReady) return;
        const fetchDocumentDetails = async () => {
            try {
                const payload = {
                    documentId: documentId
                }
                const response = await axios.post(`${DEV_BASE_URL}/document/details`, payload);
                if (response?.data.success && response?.data.documentSignerDetails) {
                    setDocumentDetails(response?.data.documentSignerDetails as any);
                }
            } catch (error) {
                console.error("Error fetching document details:", error);
            }
        };
        if (documentId) {
            fetchDocumentDetails();
            fetchDocSigned();
        }
    }, [documentId,router.isReady]);


    const handleDownloadClick = async () => {
        if (pdfFile && documentDetails) {
            try {
                const originalPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
                const originalPdfDoc = await PDFDocument.load(originalPdfBytes);

                const checkPdfElement = document.getElementById("checkPdfElement");
                if (!checkPdfElement) {
                    console.error("Element #checkPdfElement not found.");
                    return;
                }

                const canvas = await html2canvas(checkPdfElement, {
                    scale: window.devicePixelRatio, // Use device pixel ratio for better resolution
                    useCORS: true, // To handle cross-origin images
                });

                const checkPdfDataUrl = canvas.toDataURL('image/png');
                const checkPdfImage = await originalPdfDoc.embedPng(checkPdfDataUrl);

                // A4 dimensions in points
                const pdfWidth = 595.28;  // A4 width
                const pdfHeight = 841.89; // A4 height

                // Calculate the width and height for the image to maintain the aspect ratio
                let imageWidth = pdfWidth;
                let imageHeight = canvas.height * (pdfWidth / canvas.width);

                // Check if the scaled height is greater than the PDF page height
                if (imageHeight > pdfHeight) {
                    // If so, scale down the image to fit the page
                    const scaleFactor = pdfHeight / imageHeight;
                    imageWidth = imageWidth * scaleFactor;
                    imageHeight = pdfHeight;
                }

                const checkPdfPage = originalPdfDoc.addPage([pdfWidth, pdfHeight]);

                // Calculate the position to start at the top of the page
                const yPos = pdfHeight - imageHeight;

                // Draw the image at the calculated position
                checkPdfPage.drawImage(checkPdfImage, {
                    x: 0, // Start from the left
                    y: yPos, // Start from the calculated top position
                    width: imageWidth,
                    height: imageHeight,
                });

                const mergedPdfBytes = await originalPdfDoc.save();
                const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);

                const link = document.createElement('a');
                link.href = mergedPdfUrl;
                link.download = 'document.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error generating PDF:", error);
            }
        }
    };

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
                            <DownloadSectionSec documentId={documentId} file={pdfFile} handleDownloadClick={handleDownloadClick} />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SignedSuccessful;