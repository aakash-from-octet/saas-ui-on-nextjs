import React, { useEffect, useRef, useState } from 'react';
import { usePDF } from 'react-to-pdf';
import { LOGO } from '@/Components/utils/image-constants'
import { Col, Image, Row } from 'antd';
import axios from 'axios';
import { DEV_BASE_URL} from '@/config';
import { useRouter } from 'next/router';
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
};
const CheckPdf = ({ documentId: propDocumentId, handlePdfhere }: { documentId?: any; handlePdfhere?: any; }) => {
   const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
    const [documentDetails, setDocumentDetails] = useState(null);
    const [auditData, setAuditData] = useState<any>([]);
    const router = useRouter(); // Use the useRouter hook
    const documentId = propDocumentId || router.query.documentId;
    useEffect(() => {
        const fetchDocumentDetails = async () => {
            try {
                const payload = { documentId: documentId };
                const response = await axios.post(`${DEV_BASE_URL}/document/details`, payload);
                if (response?.data.success && response?.data.documentSignerDetails) {
                    setDocumentDetails(response?.data.documentSignerDetails as any);
                }
            } catch (error) {
                console.error("Error fetching document details:", error);
            }
        };
        const fetchAuditLogs = async () => {
            try {
                const response = await axios.post(`${DEV_BASE_URL}/document/audit-logs`, { id: documentId });
                console.log(response.data.data.auditLogsData, "audit")
                if (response.data.success) {
                    setAuditData(response?.data?.data?.auditLogsData);
                }
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            }
        };
        if (documentId) {
            fetchDocumentDetails();
            fetchAuditLogs();
        }
    }, [documentId]);
    const docSigned =
        documentDetails?.signers?.every((signee) => signee.isSignDone) ?? false;
    return (
        <div>
         {/* <button onClick={() => toPDF()}>Download PDF</button> */}
            {/* {docSigned ? ( */}
                <div className='audit-trail-container-outer'>
                    <div className='audit-trail-inner-container' ref={targetRef} id="checkPdfElement">
                        {/* audit trail file header */}
                        <div className='audit-file-header space-between'>
                            <Image src={LOGO.src} alt="logo" preview={false} />
                            <p className='text-18 font-600 text-p'>Audit Trail</p>
                        </div>
                        {/* audit trail main content */}
                        <div className='audit-file-content'>
                            {/* document details */}
                            <div className='div-col gap-20 mb-40'>
                                <p className='audit-subheads'>Document Details</p>
                                <Row gutter={[24, 20]} justify={'space-between'}>
                                    <Col span={8}> <p className='text-dark text-14 font-400'>File Name </p> </Col>
                                    <Col span={16}> <p className='text-dark text-14 font-600'>{documentDetails?.documetName}</p> </Col>
                                    <Col span={8}> <p className='text-dark text-14 font-400'>Document Id </p> </Col>
                                    <Col span={16}> <p className='text-dark text-14 font-600'>{documentId}</p> </Col>
                                    <Col span={8}> <p className='text-dark text-14 font-400'>Status </p> </Col>
                                    <Col span={16}> <p className={`font-500 ${docSigned ? "text-green3" : "text-yellow"
                  }`}>  {documentDetails?.documentStatus === 'Inprogress' ? 'In Progress' : documentDetails?.documentStatus}</p> </Col>
                                </Row>
                            </div>
                            {/* document history */}
                            <div className='div-col gap-20 mb-40'>
                                <p className='audit-subheads'>Document History</p>
                                {auditData.map((audit, index) => {
                                    return (
                                        <Row key={index} gutter={[24, 20]} justify={'space-between'} className='audit-trail-details'>
                                            <Col span={8}>
                                                <div className='audit-trail-details-headers div-col gap-5'>
                                                    <h4>{audit.action}</h4>
                                                    <p className='audit-trail-time'>{formatDate(audit?.createdAt)
                                                    }</p>
                                                </div>
                                            </Col>
                                            <Col span={16}>
                                                <div className='audit-trail-details-info div-col gap-5'>
                                                    {audit.descriptions.map((description, descIndex) => (
                                                        <p key={descIndex} className='audit-trail-info1'>{description}</p>
                                                    ))}
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        </div>
                        {/* audit trail footer */}
                        <div className='audit-trail-footer align-end gap-6 justify-end'>
                            <p className='text-13 text-gray font-500'> Processed by</p>
                            <Image src={LOGO.src} alt="logo" preview={false} width={78} className='img-centered' />
                        </div>
                    </div>
                </div>
            {/* ) : (<div />)} */}
        </div>
    );
};
export default CheckPdf;