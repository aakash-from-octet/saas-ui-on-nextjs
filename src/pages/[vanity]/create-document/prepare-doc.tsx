import NavbarBuilder from '@/Components/Common/NavbarBuilder';
import PdfBuilder from '@/Components/Common/PdfBuilder';
import { DEV_BASE_URL } from '@/config';
import React, { useEffect, useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import { Spin } from 'antd';
import axios from 'axios';
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PrepareDocument = () => {
    const [loading, setLoading] = useState(true);
    const [docID, setDocID] = useState("");
    const [pdfDoc, setPdfDoc] = useState(null);
    const [docName, setdocName] = useState("");
    const [signers, setSigners] = useState<any>([])
    const [numPages, setNumPages] = useState(0);
    const [pdfUrl, setPdfUrl] = useState("");

    useEffect(() => {
        const init = () => {
            const documentId = sessionStorage.getItem('ProductdocumentId') || "";
            const fileName = sessionStorage.getItem('fileName') || "";
            setdocName(fileName);
            setDocID(documentId);
            setLoading(false);
        };
        if (typeof window !== 'undefined') {
            init();
        }
    }, []);

    const loadPdfDocument = async (pdfUrl) => {
        try {
            console.log(`Loading PDF from URL: ${pdfUrl}`);
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            console.log(`PDF loaded with ${pdf.numPages} pages.`);
            setNumPages(pdf.numPages); 
            setPdfDoc(pdf); 
        } catch (error) {
            console.error(`Error loading PDF document: ${error}`);
        }
    };
const fetchDocumentDetails = async () => {
    try {
        const documentId = docID;
        if (!documentId) return;
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
            setPdfUrl(pdfUrl); 
            loadPdfDocument(pdfUrl);
           
        } else {
            console.error(`Request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching document details:", error);
    } finally {
        setLoading(false);
    }
  };
 
    const fetchSignersDetails = async () => {
        const token = sessionStorage.getItem("accessToken") || "";
        const documentId = docID;
        if (!documentId) return;
        const requestBody = { documentId };
        try {
            const response = await axios.post(`${DEV_BASE_URL}/document/details`, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            });
            console.log(response.data.documentSignerDetails);
            setSigners(response.data.documentSignerDetails.signers)
        } catch (error) {
            console.error("Error fetching signers details:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (docID) {
            fetchDocumentDetails();
            fetchSignersDetails();
        }
    }, [docID]);
    console.log(signers, "signersDAta")
    console.log(numPages,"numm")

    if (loading) {
        return <Spin />;
    }
    console.log(pdfDoc,"urlll")
    return (
        <div>
            <PdfBuilder
                product={true}
                pdfDoc={pdfDoc}
                docID={docID}
                docName={docName}
                loading={loading}
                signers={signers}
                fetchDocumentDetails={fetchDocumentDetails}
            />
        </div>
    );
};
export default PrepareDocument;
