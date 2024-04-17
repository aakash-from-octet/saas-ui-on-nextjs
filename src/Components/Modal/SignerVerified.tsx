import React, { useEffect, useState } from "react";
import { Modal, Image } from "antd";
import { SIGNER_VERFIED } from "@/Components/utils/image-constants";
import { useRouter } from "next/router";

const SignerVerified = ({ urlData , documentId}: any) => {
  const router = useRouter();
  console.log(urlData,documentId);
  const [isModalOpen, setIsModalOpen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      router.push({
        pathname: "/me-others-flow",
        query: { urlData: urlData,
        documentId:documentId
        },
      });
    }, 1000);
  });
  return (
    <Modal
      centered
      mask={false}
      width={417}
      title={null}
      maskClosable={true}
      className="m-double-header add-recipient-modal"
      open={isModalOpen}
      footer={null}
      closeIcon={null}
    >
      <div className="modal-content-details p-24 border-0">
        <div className="div-col p-10 gap-8 align-center">
          <Image
            src={SIGNER_VERFIED.src}
            alt="verified"
            preview={false}
            className="mb-12"
          />
          <p className="text-18 font-600 text-p">Authentication Completed</p>
          <p className="text-12 font-400 text-gray400">
            Authentication has been completed sucessfully
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SignerVerified;
