import React, { useEffect, useState } from "react";
import { Button, Modal, Image, Col, Row, message, notification } from "antd";
import { RESET_DOC } from "@/Components/utils/image-constants";
import axios from "axios";
import { DEV_BASE_URL} from "@/config";
import { AnyMxRecord } from "dns";
import ManageSignee from "./ManageSigneeModal";
import { useDispatch } from "react-redux";
import { clearSignaturesAndPlaceholders } from "@/redux/action";
const ManageSigneePopup = ({
  setSignatures,
  signatures,
  resetPdf,
  fetchDocumentDetails,
  setmanageSigneepopup,
  signersData,
  documentId,
  form,
  selectedRecipient,
  manageSigneePopup,
  setManageSigneeModalOpen,
  setDateElements,
  textElements,
  setTextElements,
}: {
  setBoxesForOtherSignees?: any;
  boxesForOtherSignees?: any;
  setSignatures?: any;
  signatures?: any;
  resetPdf?: any;
  closeBothModals?:any;
  updateList?:any;
  fetchDocumentDetails?: any;
  signersData?: any;
  setmanageSigneepopup?: any;
  selectedRecipient?: any;
  form?: any;
  documentId?: any;
  onSignersDataUpdate?: any;
  manageSigneePopup?: any;
  setManageSigneeModalOpen?: any;
  closeManageSigneeModal?: any;
  dateElements?: any;
  setDateElements?: any;
  textElements?: any;
  setTextElements?: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalKey, setModalKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
    setmanageSigneepopup(false);
  };
  const reset = () => {
    resetPdf();
    setSignatures([]);
    setDateElements([]);
    setTextElements([]);
    console.log('reset doneeeeee,', signatures);
      
  };

  const handleOk = async () => {
    setIsLoading(true)
    const formValues = form?.getFieldsValue();
    console.log(formValues, "formValue");
    const updatedSignees: any = formValues?.signees?.map((formSignee) => {
      const existingSigner = signersData.find(
        (signer) => signer.email === formSignee.email
      );
      console.log('existingSigner', signersData);
      if (existingSigner) {
        return {
          ...formSignee,
          isDocumentOwner: false,
          _id: existingSigner._id,
          recipient: "Signer",
        };
      } else {
        return { ...formSignee, isDocumentOwner: false ,  recipient: "Signer",};
      }
    });
    const documentOwner =
      signersData && signersData?.find((signer) => signer.isDocumentOwner);
    if (documentOwner) {
      updatedSignees?.push({
        name: formValues.name || documentOwner.name,
        email: formValues.email || documentOwner.email,
        isDocumentOwner: true,
        _id: documentOwner._id,
        recipient: "Signer",
      });
    } else {
      updatedSignees.push({
        name: formValues.name,
        email: formValues.email,
        recipient: "Signer",
        isDocumentOwner: true,
      });
    }
    const payload = {
      documentId: documentId,
      eSigne: selectedRecipient === "1" ? "Me Only" : "Me and  Others",
      eSigners: updatedSignees,
    };
    try {
      const response = await axios.put(
        `${DEV_BASE_URL}/document/add-signers`,
        payload
      );
      if (response.data.success) {
        reset();
        notification.success({
          message: "Success!",
          description: "Signers Updated Successfully.",
          duration: 1,
          placement: "bottomRight",
        });
        fetchDocumentDetails()

  
      } else {
        notification.error({
          message: "Error!",
          description: `${response.data.message}`,
          duration: 1,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error updating signees:", error.response || error.message);
    }

    finally {
      setIsLoading(false); // End loading whether the request was successful or failed
      setmanageSigneepopup(false);
      setManageSigneeModalOpen(false);
      fetchDocumentDetails();
    }
  }

  return (
    <>
      <Modal
        title={null}
        width={394}
        maskClosable={true}
        className="alert-modal"
        open={manageSigneePopup}
        footer={null}
        closeIcon={null}
     
      >
        <div className="alert-modal-content">
          <div className="alert-modal-img br-8">
            <Image
              src={RESET_DOC.src}
              preview={false}
              alt="alert"
              width={73}
              height={73}
            />
          </div>
          <div className="text-center alert-modal-details">
            <p>Managing Signees</p>
            <p>
              By adding new signees please note that the document will reset. Do
              you want to continue?
            </p>
          </div>
        </div>
        <div className="modal-content-footer alert-modal-footer">
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Button size="large" block onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col span={12}>
            <Button type="primary" block size="large" onClick={handleOk} loading={isLoading}>
  Yes
</Button>

            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};
export default ManageSigneePopup;