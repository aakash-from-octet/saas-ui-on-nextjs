import {
    Button,
    Divider,
    Image,
    Input,
    Modal,
    Select,
    Switch,
    Tag,
    notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { ARROW_DOWN, MODAL_CLOSE_SM } from "@/Components/utils/image-constants";
import { useRouter } from "next/router";
import axios from "axios";
import { DEV_BASE_URL } from "@/config";
import SignerVerificationModal from "./SignerVerification";
const { TextArea } = Input;

const SendDocModal = ({
    isSendDocModal,
    mailData,
    setIsSendDocModal,
    docName,
    documentId,
    isUpdate,
    modifiedPdf
}: {
    mailData?: any;
    isSendDocModal?: any;
    setIsSendDocModal?: any;
    docName?: any;
    documentId?: any
    isUpdate?: boolean;
    modifiedPdf?:any;
}) => {
    const router = useRouter();
    const [emailMessage, setEmailMessage] = useState("");
    const [expireDate, setExpireDate] = useState("3days");
    const [otpVerificationModal, setOtpVerificationModal] = useState(false);
    const [isDocNameModal, setIsDocNameModal] = useState(false);
    const [isResetDoc, setIsResetDoc] = useState(false);
    const [isSaveDraft, setIsSaveDraft] = useState(false);
    const [docId, setdocId] = useState<any>("")
    const[signerEmail,setSignerEmail]=useState<any>("")
    const [docIdLoading, setDocIdLoading] = useState<boolean>(true);

    const [isReminderEnabled, setIsReminderEnabled] = useState(false);
    const handleReminderSwitchChange = (checked) => {
        setIsReminderEnabled(checked);
    };
    useEffect(() => {
        let documentId, signerEmail: any;
        setDocIdLoading(true);
        if (typeof window !== 'undefined') {
            documentId = sessionStorage.getItem('ProductdocumentId') || "";
            setdocId(documentId);
            signerEmail = sessionStorage.getItem('signerEmail') || "";
            setSignerEmail(signerEmail);

        }
        setDocIdLoading(false);
    }, []);
    const initiateEsign = async () => {
        try {
            const token = sessionStorage.getItem("accessToken") || "";
            const response = await axios.put(
                `${DEV_BASE_URL}/document/initiate-esign`,
                {
                    documentId: documentId,
                    signerEmail: signerEmail,
                    data: {} // Add additional data if needed
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            if (response.data.success === true) {
                notification.success({
                    message: "Success",
                    description: `${response.data.message}`,
                    placement: "bottomRight",
                    className: "toast-primary",
                    duration: 1,
                });
                setIsSendDocModal(false);
                setOtpVerificationModal(true);
            } else {
                notification.error({
                    message: "Error",
                    description: `${response.data.message}`,
                    placement: "bottomRight",
                    className: "toast-primary",
                    duration: 2,
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: `Something Went Wrong`,
                placement: "bottomRight",
                className: "toast-primary",
                duration: 2,
            });
        }
    };

    const calculateExpireDays = (expireDateOption) => {
        switch (expireDateOption) {
            case '3days':
                return '3';
            case '7days':
                return '7';
            case '1month':
                return '30';
            case '6months':
                return '180';
            case '1year':
                return '365';
            default:
                return '3'; // Default value if no match
        }
    };
    const expireDays = calculateExpireDays(expireDate);

   
    

    //this is when we update the details
    const handleUpdate = () => {
        setIsSendDocModal(false);
    }
    const handleCancel = () => {
        setIsSendDocModal(false);

    };

    return (
        <>
            <Modal
                width={474}
                centered
                maskClosable={true}
                className="m-double-header modal-topclose modal-nopadding"
                open={isSendDocModal}
                footer={null}
                closeIcon={
                    <Image
                        src={MODAL_CLOSE_SM.src}
                        className=""
                        preview={false}
                        alt="modal-close"
                        onClick={handleCancel}
                    />
                }
                title={<p className="text-p text-16 font-600 p-24 pb-0">Settings</p>}
            >
                <div className="div-col gap-16 p-24">
                    <div className="div-col gap-10">
                        {/* for signers  */}
                        <div className="div-col gap-8">
                            <p className="text-12 text-gray font-600 w-50">Signers</p>
                            <div className="senddoc-signers-details">
                                {mailData?.signers
                                    ?.filter((signer) => signer?.recipient === "Signer")
                                    ?.map((signer, index) => (
                                        <Tag key={index} className="senddoc-signer-tag align-center">
                                            <span className="senddoc-tagletter signer-tagletter">
                                                {signer?.name[0]?.toUpperCase()}
                                            </span>
                                            {signer?.name}
                                        </Tag>
                                    ))}
                            </div>
                        </div>

                    </div>
                    <Divider className="m-0" />
                    {/* title of doc  */}
                    <div className="div-col gap-8">
                        <p className="text-12 font-600 text-gray">Title of email</p>
                        <Input
                            placeholder="Document Name"
                            value={mailData?.documetName}
                            // onChange={(e) => e.target.value}
                            className="modal-input text-12 font-600"
                        />
                    </div>
                    {/* message of doc  */}
                    <div className="div-col gap-8">
                        <p className="text-12 font-600 text-gray">Message</p>
                        <TextArea
                            rows={2}
                            autoSize={false}
                            style={{ resize: "none" }}
                            className="p-12 text-14 font-400"
                            onChange={(e) => setEmailMessage(e.target.value)}
                        />
                    </div>
                    <Divider className="my-10" />
                    {/* switches for auto-remainder */}
                    <p className="text-p text-14 font-600">Do you want to send Reminders?</p>
                    <div className="div-row align-center gap-12">
                        <Switch size="small" onChange={handleReminderSwitchChange}/>
                        <p className="text-12 font-500 text-p">Auto Reminder</p>

                    </div>
                    {/* expiry document */}
                    <div className="div-row align-center gap-10 mt-n5">
                        <p className="text-12 font-500 text-gray w-150">
                            Expire Document After
                        </p>
                        <Select
                            defaultValue={expireDate}
                            onChange={setExpireDate}
                            style={{ width: 100 }}
                            popupClassName="expiry-doc-select-popup"
                            suffixIcon={
                                <Image src={ARROW_DOWN.src} preview={false} alt="open" />
                            }
                            className="expiry-doc-select"
                            options={[
                                { value: "3days", label: "3 days" },
                                { value: "7days", label: "7 days" },
                                { value: "1month", label: "1 month" },
                                { value: "6months", label: "6 months" },
                                { value: "1year", label: "1 year" },
                            ]}
                        />
                    </div>

                </div>
                {/* modal footer  */}
                <div className="div-row gap-20 alert-modal-footer">
                    <Button
                        type="default"
                        size="large"
                        className="text-12"
                        block
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    {isUpdate ? (
                        <Button
                            type="primary"
                            size="large"
                            className="text-12"
                            block
                            onClick={handleUpdate}
                        >
                            Save & Update
                        </Button>
                    ) :
                        (
                            <Button
                                type="primary"
                                size="large"
                                className="text-12"
                                block
                                onClick={initiateEsign}
                            >
                                Send Document
                            </Button>
                        )}
                </div>
            </Modal>
            <SignerVerificationModal
            expireDays={expireDays}
            mailData={mailData}
            reminder={isReminderEnabled}
            documentId={docId}
            signerEmail={signerEmail}
            initiateEsign={initiateEsign}
                otpVerificationModal={otpVerificationModal}
                setOtpVerificationModal={setOtpVerificationModal}
            />
        </>
    );
};
export default SendDocModal;
