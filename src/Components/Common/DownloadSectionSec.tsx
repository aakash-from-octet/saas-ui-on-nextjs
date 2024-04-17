import { DEV_BASE_URL } from "@/config";
import { Button, Col, Divider, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import CheckPdf from "@/pages/audit-trail-page";
import { pdf } from '@react-pdf/renderer';
import moment from "moment";


interface Signer {
  name: string;
  email: string;
  isAgreed: boolean;
  isSignDone: boolean;
  isDocumentOwner: boolean;
  signCompletedOn: string;
  recipient?: 'Signer' | 'CC'; 
}

interface DocumentDetails {
  documentOwnerEmail: any;
  documentCreatedOn: string;
  documentStatus: string;
  signers: Signer[];
  documentOwnerName: any
  documetName?: string;

}
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};


const DownloadSectionSec = ({ documentId, file, handleDownloadClick }: { documentId?: any; file?: any; handleDownloadClick?: any }) => {
  console.log(file, "downloaadsec")
  const [documentDetails, setDocumentDetails] =
    useState<DocumentDetails | null>(null);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const payload = {
          documentId: documentId
        }
        const response = await axios.post(`${DEV_BASE_URL}/document/details`, payload);

        if (response?.data.success && response?.data.documentSignerDetails) {
          setDocumentDetails(response?.data.documentSignerDetails as DocumentDetails);
         
        }
      } catch (error) {
        console.error("Error fetching document details:", error);
      }
    };

    if (documentId) {
      fetchDocumentDetails();
      console.log('final,: ', documentDetails);
    }
  }, [documentId]);
  const signersExcludingCC = documentDetails?.signers?.filter(signee => signee?.recipient !== 'CC');
  const docSigned =
    documentDetails?.signers?.every((signee) => signee.isSignDone) ?? false;

  console.log('final1234,: ', documentDetails);


  return (
    <div className="download-section-outer div-col">
      <div className="download-content-secondary">
        <div className="div-col gap-6 p-primary">
          <p className="text-15 font-600 text-p">
            {documentDetails?.documetName}
          </p>
          <p className="text-13 font-500 text-gray">
            {documentDetails ? moment(documentDetails.documentCreatedOn).format('MMM D, YYYY h:mm a [UTC]Z') : ''}
          </p>
          <p className="text-12 font-400 text-p">
            Document Created by {documentDetails?.documentOwnerName && documentDetails?.documentOwnerEmail ?
              `${documentDetails?.documentOwnerName} (${documentDetails?.documentOwnerEmail})` :
              null}
          </p>

          <Divider className="my-10" />
          <div className="space-between">
            <p className="text-13 lh-22 font-500">
              Status{" "}
              <span
                className={`font-500 ${docSigned ? "text-green3" : "text-yellow"
                  }`}
              >
               <span
  className={`font-500 ${docSigned ? "text-green3" : "text-yellow"}`}
>
  {documentDetails?.documentStatus === 'Inprogress' ? 'In Progress' : documentDetails?.documentStatus}
</span>
              </span>
            </p>
            {!docSigned && (
              <p className="text-13 font-500 text-gray">
                Expires in<span className="ml-6 text-p font-600">2 days</span>
              </p>
            )}
          </div>
        </div>

        <div className="order-recipient-table">
          {/* signer  */}
          {signersExcludingCC?.map((signee, index) => (
            <Row
              key={index}
              gutter={[5, 10]}
              align={"bottom"}
              className="order-recipient-table-content"
            >
              <Col span={14}>
                <div>
                  <p className="text-12 font-400 text-gray mb-16">
                    Signer #{index + 1}
                  </p>
                  <div className="div-row align-center gap-8">
                    {/* avatar  */}
                    <p className={`signed-signer-letter ${signee.isSignDone ? 'success' : 'pending'} text-14 font-400`}>{signee?.name.charAt(0)}</p>
                    {/* name and email */}
                    <div className="div-col">
                      <p className="text-13 font-600 text-p text-capital">
                        {signee?.name}
                        <span>{signee?.isDocumentOwner ? " (Me)" : ""}</span>
                      </p>
                      <p className="text-13 font-400 text-gray">{signee?.email}</p>
                    </div>
                  </div>

                </div>
              </Col>
              <Col span={10}>
                <div className="div-col">
                  <p
                    className={`text-12 text-end font-500 mb-6 ${signee.isSignDone ? "text-green3" : "text-yellow"
                      } `}
                  >
                    {signee.isSignDone ? "Signed" : "Not Signed Yet"}
                  </p>
                  {signee.signCompletedOn && (
                    <p className=" text-end text-12 font-400 text-gray">{'on ' + moment(signee.signCompletedOn).format('MMM D, YYYY')}</p>
                  )}
                </div>

              </Col>
            </Row>
          ))}
          {/* {docSigned && ( */}
          <div className="space-between mt-20 w-full">
            <p className="text-14 font-500 text-black">
              Download Signed Document
            </p>
            <Button disabled={!docSigned} size="large" className="download-btn" onClick={handleDownloadClick}>Download PDF</Button>
          </div>
          {/* )} */}
        </div>
      </div>

      {/* {!docSigned && (
        <div className="download-content-sec-footer">
          <div className="align-center gap-6">
            <p className="text-13 font-500 text-gray">
              Document No Longer Needed?
            </p>
            <Button size="large" type="text" className="p-0 text-13">
              Cancel Document
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DownloadSectionSec;
