import React, { useState } from "react";
import { Button, Modal, Image, Checkbox, notification } from "antd";
import { LEGAL_CONSENT, MODAL_CLOSE } from "@/Components/utils/image-constants";
import { DEV_BASE_URL} from "@/config";
import DeleteModal from "./DeleteModal";

const LegalConsentModal = ({
    documentId,
    signerEmail,
    isSignersFlow,
    setSignerConsentModal,
    setSignReceivedModal,
    setUserConsentModal,
    setUserVerificationModal,
}: any) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isAgreed, setIsAgreed] = useState(false);

    const handleOk = async () => {
        if (!isAgreed) {
            notification.error({
                message: "Error",
                description: "Please check the box to agree before proceeding.",
                duration: 2,
                placement: "bottomRight",
            });
            return;
        }
        setIsModalOpen(false);

        if (isSignersFlow) {
            setSignerConsentModal(false);
            setSignReceivedModal(true);
        } else {
            try {
                const legalConsentResponse = await fetch(`${DEV_BASE_URL}/document/legal-concent`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ signerEmail, documentId, isAgreed }),
                });

                if (legalConsentResponse.ok) {
                    const initiateSignResponse = await fetch(`${DEV_BASE_URL}/document/initiate-esign`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ signerEmail, documentId }),
                    });

                    if (initiateSignResponse.ok) {
                        notification.success({
                            message: "Success!",
                            description: "OTP Sent Successfully on Your Email Id",
                            duration: 2,
                            placement: "bottomRight",
                        });
                        setUserConsentModal(false);
                        setUserVerificationModal(true);
                    } else {
                        // Error in initiate-esign
                        notification.error({
                            message: "Error!",
                            description: "Failed to initiate e-sign process.",
                            duration: 2,
                            placement: "bottomRight",
                        });
                    }
                } else {
                    // Error in legal-consent
                    notification.error({
                        message: "Error!",
                        description: "Failed to confirm legal consent.",
                        duration: 2,
                        placement: "bottomRight",
                    });
                }
            } catch (error) {
                console.error("Error making API call", error);
                notification.error({
                    message: "Error!",
                    description: "An error occurred while processing your request.",
                    duration: 2,
                    placement: "bottomRight",
                });
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            title={null}
            maskClosable={true}
            className="consent-modal"
            open={isModalOpen}
            footer={null}
            closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}
        >
            <div>
                <Image
                    src={LEGAL_CONSENT.src}
                    preview={false}
                    alt="legal-consent"
                    className="img-centered w-full"
                />
                <div className="p-24">
                    <p className="text-18 font-600 text-p mb-12">Legal Consent</p>
                    <Checkbox
                        className="consent-checkbox"
                        onChange={(e) => setIsAgreed(e.target.checked)}
                    >
                        I understand that this document signed with my e-signature will be
                        considered as a legal document.
                    </Checkbox>
                </div>
            </div>

            <div className="modal-content-footer consent-modal-footer">
                <Button type="primary" size="large" block onClick={handleOk}>
                    Yes, I Agree
                </Button>
            </div>
        </Modal>
    );
};

export default LegalConsentModal;