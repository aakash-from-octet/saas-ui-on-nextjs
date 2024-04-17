import otp from "@/pages/product/otp";
import { Modal, Button, Image, notification } from "antd";
import React, { useState } from "react";
import { MODAL_CLOSE } from "@/Components/utils/image-constants";
import { useRouter } from "next/router";
import OtpInput from "react-otp-input";
import VerifiedSuccess from "@/Components/Modal/VerifiedSuccess";
import VerifiedSuccessProduct from "./VerifiedSuccessPro";
import { DEV_BASE_URL } from "@/config";
import axios from "axios";

const SignerVerificationModal = ({
  expireDays,
  mailData,
  signerEmail,
  reminder,
  documentId,
  otpVerificationModal,
  setOtpVerificationModal,
  initiateEsign
}: {
  mailData?: any;
  reminder?: any;
  expireDays?: any;
  documentId?:any;
  signerEmail?: any;
  otpVerificationModal;
  setOtpVerificationModal?: any;
  initiateEsign?:any
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifiedOtpModalSec, setVerifiedOtpModalSec] = useState(false);

  const handleCancel = () => {
    setOtpVerificationModal(false);
  };

  const ModalHeader = () => {
    return (
      <div className="div-col gap-6 mb-20">
        <p className="text-p">Verification</p>
        <p className="text-14 font-400 text-gray400 lh-24">
          Please verify the OTP sent to your email address at <br />{" "}
          {signerEmail}
        </p>
      </div>
    );
  };

  const handleOk = async () => {
    const token = sessionStorage.getItem("accessToken") || "";
    try {
      const response = await axios.put(
        `${DEV_BASE_URL}/document/send`,
        {
            otp:otp,
          documentId: documentId,
          setReminder: reminder,
          expirationDate: expireDays,
          emailTitle: mailData?.documetName || "",
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      if (response.data.success == true) {
        notification.success({
          message: "Success!",
          description: `${response.data.message}`,
          duration: 2,
          placement: "bottomRight",
          className: "toast-primary",
        });
        console.log(response); // handle response
        setOtpVerificationModal(false);
        setVerifiedOtpModalSec(true);
      } else {
        notification.error({
          message: "Error!",
          description: `${response.data.message}`,
          duration: 1,
          placement: "bottomRight",
        });
      }
      // router.push('/product-signed-successful');
    } catch (error) {
      console.error(error); // handle error
    }
  };
  const handleResendOtp = () => {
    console.log("Resending OTP API here");
  };

  return (
    <>
      <Modal
        title={<ModalHeader />}
        maskClosable={true}
        className="m-double-header add-recipient-modal"
        open={otpVerificationModal}
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
        <div className="modal-content-details p-24">
          <div className="div-col gap-16">
            <p className="form-label">Enter OTP</p>
            <OtpInput
              inputStyle="otp-inputs"
              containerStyle={{ justifyContent: "space-between", gap: "12px" }}
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
            />
            <p className="text-start text-14 font-400 text-gray">
              Didn’t Received?{" "}
              <span
                className="text-link cursor-pointer"
                onClick={initiateEsign}
              >
                Resend OTP
              </span>
            </p>
          </div>
        </div>
        <div className="modal-content-footer">
          <Button type="primary" size="large" block onClick={handleOk}>
            Submit
          </Button>
        </div>
      </Modal>
      <VerifiedSuccessProduct
        verifiedOtpModalSec={verifiedOtpModalSec}
        setVerifiedOtpModalSec={setVerifiedOtpModalSec}
      />
    </>
  );
};

export default SignerVerificationModal;
