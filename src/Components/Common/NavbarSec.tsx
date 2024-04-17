import React, { useState, useReducer, useEffect } from "react";
import { LOGO } from "../utils/image-constants";
import { Row, Image, Col, Button, message, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { DEV_BASE_URL } from "@/config";
import AddRecipients from "@/Components/Modal/AddRecipients";
import ExitDoc from "@/Components/Modal/ExitDoc";
import ResetDoc from "../Modal/ResetDoc";
import VerifiedAccDoc from "../Modal/VerifiedAccDoc";
import ManageSignee from "@/Components/Modal/ManageSigneeModal";

import LegalConsentModal from "@/Components/Modal/LegalConsentModal";
import Verification from "../Modal/Verification";
import { useSelector } from "react-redux";
import ManageSigneePopup from "../Modal/ManageSigneePopup";
import axios from "axios";

const NavbarSec = ({
  logoOnly,
  finalPage,
  documentID,
  modifiedPdf,
  esignerEmail,
  signatures,
  setBoxesForOtherSignees,
  setSignatures,
  boxesForOtherSignees,
  updatePdfWithSignature,

}: {
  logoOnly?: any;
  finalPage?: boolean;
  modifiedPdf?: any;
  documentID?: any;
  signatures?: any;
  setSignatures?: any;
  esignerEmail?: any;
  setBoxesForOtherSignees?: any;
  boxesForOtherSignees?: any;
  updatePdfWithSignature?: any;

}) => {
  console.log(documentID, "documentID from navbar")
  const router = useRouter();
  const [isManageSigneeModalOpen, setManageSigneeModalOpen] = useState(false);
  const [exitDocModal, setExitDocModal] = useState(false);
  const [resetDocModal, setResetDocModal] = useState(false);
  const [manageSigneePopup, setmanageSigneepopup] = useState(false);
  const [signersData, setSignersData] = useState([]);
  const [userConsentModal, setUserConsentModal] = useState(false);
  const [isManageSigneeModalVisible, setManageSigneeModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Signloading, setSignLoading] = useState(false);
  const [userVerificationModal, setUserVerificationModal] = useState(false);
  const handleSignersDataUpdate = (updatedData) => {
    setSignersData([...updatedData]);
  };
  // console.log(updatePdfWithSignature,"updatePdfWithSignature")
  // console.log(documentID, esignerEmail, modifiedPdf, "documentID");
  useEffect(() => {
    if (typeof updatePdfWithSignature === 'function') {
      updatePdfWithSignature();

    }
  }, []);
  const documentId = documentID;
  // console.log(updatePdfWithSignature, "updatePdfWithSignature");
  // console.log(documentID, esignerEmail, modifiedPdf, "documentID");
  useEffect(() => {
    if (typeof updatePdfWithSignature === "function") {
      updatePdfWithSignature();
  
    }
  }, []);
  const updateList = async () => {
    try {
      const requestBody = {
        documentId: documentId,
      };

      const response = await axios.post(`${DEV_BASE_URL}/document/details`, requestBody);

      console.log(response?.data?.documentSignerDetails?.signers, "signers")
    } catch (error) {
      console.error("Error fetching document details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (documentId) {
      updateList();
    }
  }, [documentId]);

  console.log('esignerEmail1234', esignerEmail);
  const signerEmail = esignerEmail;
  const handleAddSigneeClick = () => {
    console.log("Add Signee Clicked");
    setManageSigneeModalOpen(true);
  };
  const handleFinishClick = async () => {
    setSignLoading(true)
    updatePdfWithSignature();
    console.log('esignerEmail12345', esignerEmail);

    const modifiedPdf: any = sessionStorage.getItem('midifiedPdfurl') || "";
    console.log(modifiedPdf, "modifiedpdf")
    const formData = new FormData();
    const signDetails = {
      documentId: documentID,
      signDetails: boxesForOtherSignees,
      signerEmail: esignerEmail,
    };
    if (modifiedPdf) {
      const response = await fetch(modifiedPdf);
      const blob = await response.blob();
      formData.append("file", blob, "signed_document.pdf");
    }
    formData.append("data", JSON.stringify(signDetails));
    try {
      const response = await fetch(`${DEV_BASE_URL}/document/add-sign-details`, {
        method: "PUT",
        body: formData,
      });
      const jsonResponse = await response.json();
      if (jsonResponse.success==true) {
        setSignLoading(false)
        setUserConsentModal(true);
        console.log("API Call Successful:", jsonResponse);
      } else {
        const errorResponse = await response.json();
        console.log(errorResponse, "response of error");
        notification.error({
          message: "Error!",
          description: `${errorResponse}`,
          duration: 1,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    // setUserConsentModal(true);
  };

  const signeeData = useSelector(
    (state: any) => state?.signeeType?.signeeType?.document?.eSigners
  );
  return (
    <div className="navbar-outer">
      <div className="space-between gap-10">
        <div className="cursor-pointer">
          <Image
            src={LOGO.src}
            alt="logo"
            preview={false}
            onClick={() => setExitDocModal(true)}
          />
          {exitDocModal && <ExitDoc setExitDocModal={setExitDocModal} />}
        </div>
        {!logoOnly && (
          <Row gutter={[15, 15]} wrap={false} align="middle">
            <Col>
              {/* onClick={() => setManageSigneeModalOpen(true)} */}
              <Button
                type="text"
                className="font-600 p-0"
                onClick={handleAddSigneeClick}
              >
                Manage Signees?
              </Button>
              {manageSigneePopup && (
                <ManageSigneePopup
                  manageSigneePopup={manageSigneePopup}
                  setmanageSigneepopup={setmanageSigneepopup}
                  documentId={documentID}
                  onSignersDataUpdate={handleSignersDataUpdate}
                  setManageSigneeModalOpen={setManageSigneeModalOpen}
                />
              )}
              {isManageSigneeModalOpen && (
                <ManageSignee
                  signatures={signatures}
                  setSignatures={setSignatures}
                  isManageSigneeModalOpen={isManageSigneeModalOpen}
                  setManageSigneeModalOpen={setManageSigneeModalOpen}
                  docID={documentID}
                  onSignersDataUpdate={handleSignersDataUpdate}
                  boxesForOtherSignees={boxesForOtherSignees}
                  setBoxesForOtherSignees={setBoxesForOtherSignees}
                />
              )}
            </Col>
            <Col>
              <Button
                type="default"
                className="dark-btn"
                onClick={() => setResetDocModal(true)}
              >
                Reset
              </Button>
              {resetDocModal && (
                <ResetDoc
                  setResetDocModal={setResetDocModal}
                  documentId={documentID}
                />
              )}
            </Col>
            <Col>
              <Button type="primary" onClick={handleFinishClick} disabled={Signloading} loading={Signloading}>
                Finish
              </Button>
              {userConsentModal && (
                <LegalConsentModal
                  documentId={documentId}
                  signerEmail={signerEmail}
                  isSignersFlow={false}
                  setUserConsentModal={setUserConsentModal}
                  setUserVerificationModal={setUserVerificationModal}
                />
              )}
              {userVerificationModal && (
                <Verification
                  documentId={documentId}
                  signerEmail={signerEmail}
                  setUserVerificationModal={setUserVerificationModal}
                  file={modifiedPdf}
                />
              )}
            </Col>
          </Row>
        )}
        {finalPage && (
          <p className="text-13 font-500 text-gray">
            Want to save your documents?
            <Button type="primary" className="h-40 ml-10" onClick={() =>  router.push('/signup')}>  Create an Account</Button>
          </p>
        )}
      </div>
    </div>
  );
};

export default NavbarSec;
