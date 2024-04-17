import { DEV_BASE_URL } from "@/config";
import { Button, Col, Divider, Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Signer {
  name: string;
  email: string;
  isAgreed: boolean;
  isSignDone: boolean;
  isDocumentOwner: boolean;
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


const DownloadSectionSignerFlow = ({ documentId, file, handleDownloadClick }: { documentId?: any; file?: any; handleDownloadClick?: any }) => {
  console.log(file, "downloaadsec")
  const [documentDetails, setDocumentDetails] =
    useState<DocumentDetails | null>(null);

  // const handleDownloadClick = () => {
  //   console.log("download")
  //   if (file) {
  //     const link = document.createElement("a");
  //     link.href = file;
  //     link.download = "document.pdf";
  //     link.click();
  //   }
  // };
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
            {" "}
            {documentDetails
              ? formatDate(documentDetails.documentCreatedOn)
              : ""}
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
                {documentDetails?.documentStatus}
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
          {documentDetails?.signers.map((signee, index) => (
            <Row
              key={index}
              gutter={[5, 10]}
              align={"bottom"}
              className="order-recipient-table-content"
            >
              <Col span={13}>
                <div>
                  <p className="text-12 font-400 text-gray mb-16">
                    Signer #{index + 1}
                  </p>
                  <p className="text-13 font-600 text-p mb-6">
                    {signee?.name}
                    <span>{signee?.isDocumentOwner ? "(Me)" : ""}</span>
                  </p>
                  <p className="text-13 font-400 text-p">{signee?.email}</p>
                </div>
              </Col>
              <Col span={11}>
                <p
                  className={`text-12 text-end font-500 mb-6 ${signee.isSignDone ? "text-green3" : "text-yellow"
                    } `}
                >
                  {signee.isSignDone ? "Signed" : "Not Signed Yet"}
                </p>
              </Col>
            </Row>
          ))}
          {/* {docSigned && ( */}
          <div className="space-between mt-20 w-full">
            <p className="text-14 font-500 text-black">
              Download Signed Document
            </p>

            <Button size="large" disabled={!docSigned} onClick={handleDownloadClick}>Download PDF</Button>
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

export default DownloadSectionSignerFlow;
