import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, notification } from 'antd';
import { CANCEL_DOC_ICON, MOVEBIN_ICON, REMINDER_ICON, } from '@/Components/utils/image-constants';
import axios from 'axios';
import { DEV_BASE_URL } from '@/config';


const CancelDocModal = ({ cancelDocModal, setCancelDocModal }: { cancelDocModal?: any; setCancelDocModal?: any; }) => {
    const [docId, setdocId] = useState<any>("")
    const handleCancel = () => {
        setCancelDocModal(false);
    };

    useEffect(() => {
        let documentId, fileName: any;
       
        if (typeof window !== 'undefined') {
            documentId = sessionStorage.getItem('ProductdocumentId') || "";
            setdocId(documentId);
           
        }
       
    }, []);

    const cancelDoc = async () => {
        try {
          const token = sessionStorage.getItem("accessToken") || "";
          const request = {
            documentId: docId,
            data: {
                documentStatus:"Cancelled",
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
           
            setCancelDocModal(false);
            notification.success({
              message: "Success",
              description: "Document has been Cencelled",
              placement: "bottomRight",
              className: "toast-primary",
              duration: 2,
            });
    
          } else {
            notification.error({
              message: "Error",
              description: "Something Went Wrong",
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
        <Modal
            title={null}
            width={394}
            maskClosable={true}
            className="alert-modal"
            open={cancelDocModal}
            footer={null}
            closeIcon={null}
        >
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={CANCEL_DOC_ICON.src} preview={false} alt="alert" width={67} height={75} />
                </div>
                <div className='text-center alert-modal-details px-2'>
                    <p>Cancel Document</p>
                    <p className='font-400'>Are you sure you want to cancel this document?</p>
                </div>
                <div className='space-between gap-20 alert-modal-footer'>
                    <Button size="large" block className='h-45' onClick={handleCancel}>Cancel</Button>
                    <Button size="large" block type='primary' className='h-45' onClick={cancelDoc}>Yes, Cancel</Button>
                </div>
            </div>
        </Modal >
    )
}

export default CancelDocModal;
