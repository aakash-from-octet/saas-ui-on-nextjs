import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Image, Tooltip, notification } from "antd";

import {
  ARROW_BACK,
  BREADCRUMB_ARROW,
} from "@/Components/utils/image-constants";
import DocumentNameModal from "@/Components/Modal/DocumentNameModal";
import { useRouter } from "next/router";
import SaveAsDraftModal from "../Modal/SaveAsDraft";
import SendDocModal from "../Modal/SendDocModal";
import axios from "axios";
import { DEV_BASE_URL } from "@/config";
import ResetModalSec from "../Modal/ResetModalSec";
import ClearAllStampsModal from "../Modal/ClearAllStamps";
import { useDispatch } from "react-redux";
import { setSelectedStatus } from "@/redux/action";
import useVanityUrl from "@/hooks/vanityURL";

const NavbarBuilder = ({ docName,
    boxesForOtherSignees,
    setBoxesForOtherSignees,
  updatePdfWithSignature,
  esignerEmail,
  modifiedPdf,
  documentID,

}: { 
  docName?: any;
  modifiedPdf?:any;
    documentID?:any;
    esignerEmail?: any;
    setBoxesForOtherSignees?: any;
    boxesForOtherSignees?: any;
    updatePdfWithSignature?: any;
}) => {
  const router = useRouter();
  const [isDocNameModal, setIsDocNameModal] = useState(false);
  const [isResetDoc, setIsResetDoc] = useState(false);
  const [isSaveDraft, setIsSaveDraft] = useState(false);
  const [isSendDocModal, setIsSendDocModal] = useState(false);
  const [docId, setdocId] = useState<any>("");
  const [mailData, setMailData] = useState<any>([]);
  const [docIdLoading, setDocIdLoading] = useState<boolean>(true);
  const [signerEmail, setSignerEmail] = useState<any>("");
  const [Signloading, setSignLoading] = useState(false);
  const dispatch = useDispatch();
  
  const vanity = useVanityUrl(); 
  useEffect(() => {
    if (typeof updatePdfWithSignature === "function") {
      updatePdfWithSignature();
    }
  }, []);
  console.log(modifiedPdf,"finalpdf")
  useEffect(() => {
    let documentId, signerEmail: any;
    setDocIdLoading(true);
    if (typeof window !== "undefined") {
      documentId = sessionStorage.getItem("ProductdocumentId") || "";
      setdocId(documentId);
      signerEmail = sessionStorage.getItem("signerEmail") || "";
      setSignerEmail(signerEmail);
    }
    setDocIdLoading(false);
  }, []);

  // const modifiedPdf: any = sessionStorage.getItem('midifiedPdfurl') || "";
  const handleFinishClick = async () => {
    setSignLoading(true)
    updatePdfWithSignature();
    console.log('esignerEmail12345', esignerEmail);
    const token = sessionStorage.getItem("accessToken") || "";
    const modifiedPdf: any = sessionStorage.getItem('midifiedPdfurl') || "";
    console.log(modifiedPdf, "modifiedpdf")
    const formData = new FormData();
    const signDetails = {
      documentId: documentID,
      signDetails: boxesForOtherSignees,
      signerEmail: signerEmail,
    };
    console.log(signDetails,"signDetails")
    if (modifiedPdf) {
      const response = await fetch(modifiedPdf);
      const blob = await response.blob();
      formData.append("file", blob, docName);
    }
    formData.append("data", JSON.stringify(signDetails));
    try {
      const response = await fetch(`${DEV_BASE_URL}/document/add-sign-details`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: token,
        },
      });
      

      const jsonResponse = await response.json();
      if (jsonResponse.success==true) {
        setSignLoading(false)
        setIsSendDocModal(true)
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
  
    setIsSendDocModal(true)
  };
  const fetchDocumentData = async () => {
    // setLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const response = await axios.post(
        `${DEV_BASE_URL}/document/details`,
        { documentId: docId },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
      if (response.data.success == true) {
        console.log(response.data.documentSignerDetails);
        setMailData(response.data.documentSignerDetails);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (docId) {
      fetchDocumentData();
    }
  }, [docId]);

  console.log(docId, "navbar");

  const Reset = async () => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const request = {
        documentId: docId,
      };
      const response = await axios.put(
        `${DEV_BASE_URL}/document/reset`,
        request,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data.success == true) {
        notification.success({
          message: "Success",
          description: "Document Reset successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
        router.push(`/${vanity}/all-documents`);
      } else {
        notification.error({
          message: "Error",
          description: "Failed to Reset the Document.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Sonmething went wrong",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };

  const saveASDrafft = async () => {
    try {
      const token = sessionStorage.getItem("accessToken") || "";
      const request = {
        documentId: docId,
        data: {
          documentStatus: "Draft",
        },
      };
      const response = await axios.put(
        `${DEV_BASE_URL}/document/update-details`,
        request,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.data.success == true) {
        dispatch(setSelectedStatus("draft"));
        notification.success({
          message: "Success",
          description: "Document Saved as Draft.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });

        router.push(`/${vanity}/draft`);
      } else {
        notification.error({
          message: "Error",
          description: "Failed to Save the Document.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Sonmething went wrong",
        placement: "bottomRight",
        className: "toast-primary",
        duration: 2,
      });
    }
  };
  return (
    <div className="navbar-outer">
      <div className="space-between gap-10">
        <div className="div-row gap-12 align-center">
          <Image
            src={ARROW_BACK.src}
            alt="back"
            preview={false}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <p className="text-gray text-16 font-600">{docName} </p>
        </div>
        <Breadcrumb
          className="create-doc-breadcrumb"
          separator={
            <Image
              src={BREADCRUMB_ARROW.src}
              alt="back"
              preview={false}
              className="cursor-pointer justify-center"
            />
          }
          items={[
            {
              title: (
                <p className="bread-label bread-active div-row align-center">
                  <span className="bread-num">1</span>Upload
                </p>
              ),
              href: `#`,
            },
            {
              title: (
                <p className="bread-label bread-active ">
                  <span className="bread-num">2</span>Add recipients
                </p>
              ),
              href: `/${vanity}/create-document/add-recipients`,
            },
            {
              title: (
                <p className="bread-label bread-active ">
                  <span className="bread-num">3</span>Prepare
                </p>
              ),
              href: `/${vanity}/create-document/prepare-doc`,
            },
          ]}
        />
        <div className="div-row gap-12 align-center">
          <Button
            type="text"
            size="small"
            className="text-small-btn"
            onClick={() => setIsSaveDraft(true)}
          >
            Save As Draft
          </Button>
          <Tooltip
            title={
              <p className="mw-155">
                This will reset all the setup and will restart from upload
                process
              </p>
            }
            placement="bottomRight"
            overlayClassName="sec-tooltip"
            trigger={"hover"}
          >
            <Button onClick={() => setIsResetDoc(true)}>Reset</Button>
          </Tooltip>

          <Tooltip
            title={
              <p className="mw-155">
                Edit document to bring the task to completion
              </p>
            }
            placement="bottomRight"
            overlayClassName="sec-tooltip"
            trigger={"hover"}
          >
            <Button type="primary" onClick={handleFinishClick} disabled={Signloading} loading={Signloading}>
                Finish
              </Button>
          </Tooltip>
        </div>
      </div>

      <SendDocModal
        docName={docName}
        documentId={docId}
        isSendDocModal={isSendDocModal}
        setIsSendDocModal={setIsSendDocModal}
        mailData={mailData}
        isUpdate={false}
        modifiedPdf={modifiedPdf}
      />
      {/* <DocumentNameModal
                isDocNameModal={isDocNameModal}
                setIsDocNameModal={setIsDocNameModal}
                isUpdate={false}
            /> */}
      <SaveAsDraftModal
        isSaveDraft={isSaveDraft}
        setIsSaveDraft={setIsSaveDraft}
        draft={saveASDrafft}
      />
      <ResetModalSec
        isResetDoc={isResetDoc}
        setIsResetDoc={setIsResetDoc}
        reset={Reset}
      />
    </div>
  );
};

export default NavbarBuilder;
