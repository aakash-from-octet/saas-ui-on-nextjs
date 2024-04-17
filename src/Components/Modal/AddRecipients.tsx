import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Button, Modal, Image, Row, Input, Form, Col, message, Checkbox, notification, Spin } from "antd";
import {
  ADD_SIGNEE,
  ME_ONLY,
  ME_OTHERS,
  MODAL_CLOSE,
  TRASH_DARK
} from "@/Components/utils/image-constants";
import { DEV_BASE_URL } from "@/config";
import { setLoadingState, setSigneeType } from "@/redux/action";
import ContinueManageSignee from "./ContinueManageSignee";
const AddisDocumentOwner = ({ DocumentID, onModalClose, onContinue, openedFromSelectedSigneeOption, manageSigneeModal, setManageSigneeModal }: { DocumentID?: any; onModalClose?: any; onContinue?: any; openedFromSelectedSigneeOption?: any; setManageSigneeModal?: any; manageSigneeModal?: boolean }) => {
  console.log(DocumentID, "doc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [isAddSigneeDisabled, setIsAddSigneeDisabled] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState(manageSigneeModal ? "2" : "1");
  const [signees, setSignees] = useState([{ name: "", email: "" }]);
  const [signeeContinue, setSigneeContinue] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [form] = Form.useForm();
  const [documentOwnerEmail, setDocumentOwnerEmail] = useState("");
  const isLoadingfetch = useSelector((state:any) => state?.isLoading);
  console.log(isLoadingfetch,"hiii")
  useEffect(() => {
    setIsModalOpen(true)
  }, [])
  const handleAddSignee = () => {
    const currentSignee = signees[signees.length - 1];
    if (currentSignee.name.trim() !== "" && currentSignee.email.trim() !== "") {
      setSignees([...signees, { name: "", email: "" }]);
    }
    setIsAddSigneeDisabled(true);
  };

  const handleDeleteSignee = (index: number) => {
    if (signees.length > 1) {
      const filteredSignees = signees.filter((_, i) => i !== index);
      setSignees(filteredSignees);
    }
  }
  const checkDuplicateEmails = (email, index) => {
    let emailCount = 0;
    signees.forEach((signee, idx) => {
      if (email === signee.email && index !== idx) {
        emailCount++;
      }
    });
    return emailCount > 0;
  };
  const handleNameChange = (index, value) => {
    const newSignees = [...signees];
    newSignees[index].name = value;
    setSignees(newSignees);
  };
  const handleEmailChange = (index, value) => {
    const newSignees = [...signees];
    newSignees[index].email = value;
    setSignees(newSignees);
  };
  const handleOk = async (values) => {
    dispatch(setLoadingState(true));
    let requestBody = {};
    const { name, email } = values;
    if (selectedRecipient === "1") {
      // Me Only
      requestBody = {
        documentId: DocumentID,
        eSigne: "Me Only",
        eSigners: [
          {
            name,
            email,
            recipient: "Signer",
            isDocumentOwner: true,
          },
        ],
      };
      onContinue([email]);
    } else {
      // Me & Others
      requestBody = {
        documentId: DocumentID,
        eSigne: "Me and Others",
        eSigners: [
          {
            name,
            email,
            recipient: "Signer",
            isDocumentOwner: true,
          },
          ...signees.map((signee) => ({
            name: signee.name,
            email: signee.email || "",
            recipient: "Signer",
            isDocumentOwner: false,
          })),
        ],
      };
    }
    try {
      const response = await fetch(`${DEV_BASE_URL}/document/add-signers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log(data, "api data");
      if (data.success === true) {
      
        notification.success({
          message: 'Success!',
          description: 'Signers Added Successfully.',
          duration: 1,
          placement: "bottomRight"

        });
       
        
        setIsModalOpen(false);
        const documentOwner = data?.document?.eSigners?.find((signer) => signer?.isDocumentOwner);
        console.log(documentOwner, "owner12")
        onContinue(documentOwner && documentOwner?.email)
        onModalClose();
      } else {

        notification.error({
          message: "Error!",
          description: `${data.message}`,
          duration: 1,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Error making API call", error);
    }finally {
      setIsLoading(false); // Set loading to false when the request is finished
    }
  };
  const handleSigneeContinue = () => {
    console.log('signeeContinue', signeeContinue);
    setSigneeContinue(true);
  }
  const handleCancel = () => {
    setManageSigneeModal(false);
  };

  const ModalHeader = () => {
    return (
      <div className="div-col gap-6 mb-20">
        <p className="text-p">Add Signees</p>
        <p className="text-14 font-400 text-gray400 lh-24">
          Please provide the necessary information to proceed
        </p>
      </div>
    );
  };
  return (
    <>
      <Modal
        centered
        title={<ModalHeader />}
        maskClosable={true}
        className="m-double-header add-recipient-modal transition-delay-modal"
        open={isModalOpen}
        footer={null}
        closeIcon={
          openedFromSelectedSigneeOption ? (
            <Image
              src={MODAL_CLOSE.src}
              preview={false}
              alt="modal-close"
              onClick={handleCancel}
            />
          ) : null
        }
      >
        <Form
          name="add_recipient_form"
          className="add-recipient-form"
          form={form}
          initialValues={{ remember: true }}
          onFinish={openedFromSelectedSigneeOption ? handleSigneeContinue : handleOk}
          onFinishFailed={(errorInfo) => {
            console.log("Validation failed:", errorInfo);
          }}
        >
          <div className="modal-content-details modal-max-h">
            <div className="div-col gap-30">
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
              <div className="div-col gap-24">
                <Row gutter={[12, 12]}>
                  <Col sm={8}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: "Enter your name." }]}
                    >
                      <Input type="text" placeholder="Enter name" className="modal-input" />
                    </Form.Item>
                  </Col>
                  <Col sm={16}>
                    <Form.Item
                      name="email"
                      rules={[{ required: true, message: "Please enter your email." }]}
                    >
                      <Input type="email" placeholder="Enter email address" className="modal-input" />
                    </Form.Item>
                  </Col>
                </Row>
                <div>
                  {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                                          <Checkbox className='add-recipient-checkbox'>I understand that this document signed with my e-signature will be considered as a legal document.</Checkbox>
                                      </Form.Item> */}
                </div>
                {selectedRecipient === "2" && (
                  <div className="div-col gap-12">
                    <p className="form-label">Other Signees</p>
                    {signees.map((signee, index) => (
                      <Row gutter={[12, 12]} key={index}>
                        <Col sm={8}>
                          <Form.Item
                            name={`name-${index}`}
                            rules={[
                              {
                                required: true,
                                message: "Enter your name.",
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              placeholder="Enter name"
                              className="modal-input"
                              value={signee.name}
                              onChange={(e) =>
                                handleNameChange(index, e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col sm={16}>
                          <div className='div-row gap-16 align-center'>
                            <Form.Item
                              name={`email-${index}`}
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your email.",
                                },
                                {
                                  validator: (_, value) => {
                                    if (checkDuplicateEmails(value, index)) {
                                      return Promise.reject(new Error('Duplicate email is not allowed.'));
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                              className='w-full'
                            >
                              <Input
                                type="email"
                                placeholder="Enter email address"
                                className="modal-input"
                                value={signee.email}
                                onChange={(e) =>
                                  handleEmailChange(index, e.target.value)
                                }
                              />
                            </Form.Item>
                            <Image src={TRASH_DARK.src} alt="delete" height={28} preview={false} className='cursor-pointer' onClick={() => handleDeleteSignee(index)} />
                          </div>
                        </Col>
                      </Row>
                    ))}
                    <Button
                      style={{ width: "100px" }}
                      type="text"
                      className="p-0 btn-with-lefticon"
                      icon={
                        <Image src={ADD_SIGNEE.src} preview={false} alt="add" />
                      }
                      onClick={handleAddSignee}
                      disabled={signees.length <= 0}
                    >
                      Add Signee
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-content-footer">
          <Button type="primary" htmlType="submit" size="large" block disabled={isLoadingfetch} loading={isLoadingfetch} >
           Continue
</Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default AddisDocumentOwner;