import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  Image,
  Row,
  Input,
  Form,
  Col,
  message,
  Checkbox,
  Spin,
} from "antd";
import {
  ADD_SIGNEE,
  ME_ONLY,
  ME_OTHERS,
  MODAL_CLOSE,
  TRASH_DARK,
} from "@/Components/utils/image-constants";
import { DEV_BASE_URL } from "@/config";
import { setSigneeType } from "@/redux/action";
import ContinueManageSignee from "./ContinueManageSignee";
import axios from "axios";
import ManageSigneePopup from "./ManageSigneePopup";
import InputSigneeSkeleton from "../Common/Skeletons/InputSigneeSkeleton";
interface Signee {
  name: string;
  email: string;
  isDocumentOwner?: boolean;
  _id?: string; // Optional property
}
const ManageSignee = ({
  signatures,
  setSignatures,
  resetPdf,
  DocumentID,
  closeBothModals,
  docID,
  setManageSigneeModal,
  setManageSigneeModalOpen,
  isManageSigneeModalOpen,
  onSignersDataUpdate,
  setIsModalOpen,
  IsModalOpen,
  boxesForOtherSignees,
  setBoxesForOtherSignees,
  dateElements,
  setDateElements,
  textElements,
  setTextElements,

}: {
  setSignatures?: any;
  signatures?: any;
  closeBothModals?: any;
  resetPdf?: any;
  DocumentID?: any;
  docID?: any;
  onSignersDataUpdate?: any;
  openedFromSelectedSigneeOption?: any;
  setManageSigneeModal?: any;
  isManageSigneeModalOpen?: any;
  IsModalOpen?: any;
  setIsModalOpen?: any;
  setManageSigneeModalOpen?: any;
  manageSigneeModal?: boolean;
  setBoxesForOtherSignees?: any;
  boxesForOtherSignees?: any;
  dateElements?: any;
  setDateElements?: any,
  textElements?: any
  setTextElements?: any;

}) => {
  console.log(isManageSigneeModalOpen, "state");
  const [name, setName] = useState("");
  const disptach = useDispatch();
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const [isAddSigneeDisabled, setIsAddSigneeDisabled] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState("2");
  const [signees, setSignees] = useState<Signee[]>([{ name: "", email: "" }]);
  const [signeeContinue, setSigneeContinue] = useState(false);
  const [manageSigneePopup, setmanageSigneepopup] = useState(false);
  const [signersData, setSignersdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchDocumentDetails = async () => {
    try {

      const requestBody = {
        documentId: docID,
      };

      const response = await axios.post(`${DEV_BASE_URL}/document/details`, requestBody);

      if (response.data.documentSignerDetails.signers) {
        const signers = response.data.documentSignerDetails.signers;
        const docOwner = signers.find((signer) => signer.isDocumentOwner);
        if (docOwner) {
          setName(docOwner.name);
          setEmail(docOwner.email);
        }
        const otherSignees = signers.filter((signer) => !signer.isDocumentOwner);
        setSignees(otherSignees);
        setSignersdata(response?.data?.documentSignerDetails?.signers);
        onSignersDataUpdate(response?.data?.documentSignerDetails?.signers);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching document details:", error);
      setLoading(false);
    }
  };

  const checkForDuplicateEmail = (email, currentIndex) => {
    return signees.some((signee, index) => signee.email === email && index !== currentIndex);
  };

  useEffect(() => {
    fetchDocumentDetails();
  }, [docID]);
  console.log(signersData, "789789");
  useEffect(() => {
    form.setFieldsValue({
      name: name,
      email: email,
      signees: signees.map((signee) => ({
        name: signee.name,
        email: signee.email,
      })),
    });
  }, [signees, name, email, form]);
  useEffect(() => {
    // Trigger re-validation of email fields whenever signees list changes
    form.validateFields(signees.map((_, index) => ['signees', index, 'email']));
  }, [signees, form]);

  const handleSigneeContinue = () => {
    form.validateFields().then((values) => {
      const currentSignees = values.signees || [];
      const isNewSigneeAdded = currentSignees?.some((signee) => {
        return !signersData?.some((existingSignee) => existingSignee.email === signee.email);
      });
      if (isNewSigneeAdded) {
        // If a new signee is added, show the manage signee popup
        setmanageSigneepopup(true);
      } else {
        // If no new signee is added, close the manage signee modal
        if (setManageSigneeModalOpen) {
          setManageSigneeModalOpen(false);
        }
      }
    }).catch((errorInfo) => {
      console.log("Validation failed:", errorInfo);
    });
  };
  
  console.log(resetPdf, "reset");
  const handleCancel = () => {
    if (setManageSigneeModalOpen) {
      setManageSigneeModalOpen(false);
    }
  };
  const ManageSigneeHeader = () => {
    return (
      <div className="div-col gap-6 mb-20">
        <p className="text-p">Manage Signees</p>
        <p className="text-14 font-400 text-gray400 lh-24">
          You can manage and add more signees
        </p>
      </div>
    );
  };
  const initialFormValues = {
    name: name,
    email: email,
    signees: signees.map((signee, index) => ({
      [`name-${index}`]: signee.name,
      [`email-${index}`]: signee.email,
    })),
  };


  return (
    <>
      <Modal
        centered
        title={<ManageSigneeHeader />}
        maskClosable={true}
        className="m-double-header add-recipient-modal"
        open={isManageSigneeModalOpen}
        footer={null}
        closeIcon={
          <Image
            src={MODAL_CLOSE.src}
            preview={false}
            alt="modal-close"
            onClick={handleCancel}
          />
        }
      >
        <Form
          name="add_recipient_form"
          className="add-recipient-form"
          form={form}
          onFinish={handleSigneeContinue}
          onFinishFailed={(errorInfo) => {
            console.log("Validation failed:", errorInfo);
          }}
        >
          <div className="modal-content-details modal-max-h">
            <div className="div-col gap-30">
              {/* Recipient Type Selection */}
              <div className="div-row gap-20">
                <div
                  className={`recipient-type ${selectedRecipient === "1"
                    ? "selected-recipient"
                    : "non-selected-recipient"
                    }`}
                  onClick={() => setSelectedRecipient("1")}
                >
                  <Image
                    src={ME_ONLY.src}
                    preview={false}
                    alt="me-only"
                    className="img-centered"
                  />
                  <p className="text-14">Me Only</p>
                </div>
                <div
                  className={`recipient-type ${selectedRecipient === "2"
                    ? "selected-recipient"
                    : "non-selected-recipient"
                    }`}
                  onClick={() => setSelectedRecipient("2")}
                >
                  <Image
                    src={ME_OTHERS.src}
                    preview={false}
                    alt="me-only"
                    className="img-centered"
                  />
                  <p className="text-14">Me & Others</p>
                </div>
              </div>
              {/* User's Name and Email */}

              <div className="div-col gap-24">
                {signersData.length > 0 ? (
                  <Row gutter={[12, 12]}>
                    <Col sm={8}>
                      <div className="div-col gap-8">
                        <p className="form-label">My Name</p>
                        <Form.Item
                          name="name"
                          rules={[
                            { required: true, message: "Enter your name." },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder="Enter name"
                            className="modal-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col sm={16}>
                      <div className="div-col gap-8">
                        <p className="form-label">My Email</p>
                        <Form.Item
                          name="email"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your email.",
                            },
                          ]}
                        >
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            className="modal-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                ) : (<InputSigneeSkeleton label={true} />)}
              </div>
              {/* Dynamic Fields for Additional Signees */}
              <div className="div-col gap-12">
                {selectedRecipient === "2" && (<p className="form-label">Other Signees</p>)}

                {selectedRecipient === "2" && (
                  <Form.List name="signees">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          signersData.length > 0 ? (
                            <Row key={field.key} gutter={[12, 12]}>
                              {/* Name field */}
                              <Col sm={8}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                  fieldKey={[field.fieldKey, 'name']}
                                  rules={[{ required: true, message: 'Enter signee\'s name.' }]}
                                >
                                  <Input placeholder="Enter name" className="modal-input" />
                                </Form.Item>
                              </Col>
                              {/* Email field */}
                              <Col sm={16}>
                                <div className='div-row gap-16 align-center'>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'email']}
                                    fieldKey={[field.fieldKey, 'email']}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter your email.",
                                      },
                                      {
                                        validator: (_, value) => {
                                          if (checkForDuplicateEmail(value, index)) {
                                            return Promise.reject(new Error('Duplicate email is not allowed.'));
                                          }
                                          return Promise.resolve();
                                        }
                                      }
                                    ]}

                                    className='w-full'
                                  >
                                    <Input placeholder="Enter email address" className="modal-input" />
                                  </Form.Item>
                                  {/* Delete button */}
                                  {fields.length > 1 && (
                                    <Image src={TRASH_DARK.src} alt="delete" height={28} preview={false} className='cursor-pointer' onClick={() => remove(field.name)} />
                                  )}
                                </div>
                              </Col>
                            </Row>) : (
                            <div key={field.key} >
                                <InputSigneeSkeleton key={index} label={false} />
                            </div>
                          )))}
                        <Button
                          style={{ width: "100px" }}
                          type="text"
                          className="p-0 btn-with-lefticon"
                          icon={
                            <Image src={ADD_SIGNEE.src} preview={false} alt="add" />
                          }
                          onClick={() => add()}
                        // disabled={signees.length <= 0}
                        >
                          Add Signee
                        </Button>
                      </>
                    )}
                  </Form.List>
                )}
              </div>
            </div>
          </div>
          <div className="modal-content-footer">
            <Button type="primary" htmlType="submit" size="large" block>
              Continue
            </Button>
          </div>
        </Form>
      </Modal>
      {manageSigneePopup && (
        <ManageSigneePopup
          dateElements={dateElements}
          closeBothModals={closeBothModals}
          setDateElements={setDateElements}
          textElements={textElements}
          setTextElements={setTextElements}
          boxesForOtherSignees={boxesForOtherSignees}
          setBoxesForOtherSignees={setBoxesForOtherSignees}
          signatures={signatures}
          setSignatures={setSignatures}
          resetPdf={resetPdf}
          fetchDocumentDetails={fetchDocumentDetails}
          manageSigneePopup={manageSigneePopup}
          form={form}
          setmanageSigneepopup={setmanageSigneepopup}
          documentId={docID}
          setManageSigneeModalOpen={setManageSigneeModalOpen}
          selectedRecipient={selectedRecipient}
          signersData={signersData}
        />
      )}
      {signeeContinue && (
        <ContinueManageSignee
          setSigneeContinue={setSigneeContinue}
          setManageSigneeModal={setManageSigneeModal}
        />
      )}
    </>
  );
};
export default ManageSignee;