import React, { useEffect, useState } from 'react';
import { Button, Image, Modal, notification } from 'antd';
import { MOVEBIN_ICON, REMINDER_ICON, } from '@/Components/utils/image-constants';
import axios from 'axios';
import { DEV_BASE_URL } from '@/config';


const MoveToBinModal = ({ movetobinModal, setMovetobinModal }: { movetobinModal?: any; setMovetobinModal?: any; }) => {
    const [docIdLoading, setDocIdLoading] = useState<boolean>(true);
    const [docId, setdocId] = useState<any>("");

    const handleCancel = () => {
        setMovetobinModal(false);
    };
    useEffect(() => {
        let documentId, signerEmail: any;
        setDocIdLoading(true);
        if (typeof window !== "undefined") {
          documentId = sessionStorage.getItem("ProductdocumentId") || "";
          setdocId(documentId);
         
        
        }
        setDocIdLoading(false);
      }, []);

    const moveTobin = async () => {
        try {
          const token = sessionStorage.getItem("accessToken") || "";
          const request = {
            documentId: docId,
            data: {
                moveToBin:true,
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
           
            setMovetobinModal(false);
            notification.success({
              message: "Success",
              description: "Document Moved to bin",
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
            open={movetobinModal}
            footer={null}
            closeIcon={null}
        >
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={MOVEBIN_ICON.src} preview={false} alt="alert" width={67} height={75} />
                </div>
                <div className='text-center alert-modal-details px-2'>
                    <p>Move to Bin</p>
                    <p className='font-400'>Are you sure you want to move this file to bin?</p>
                </div>
                <div className='space-between gap-20 alert-modal-footer'>
                    <Button size="large" block className='h-45' onClick={handleCancel}>Cancel</Button>
                    <Button size="large" block type='primary' className='h-45' onClick={moveTobin}>Yes, Move To Bin</Button>
                </div>
            </div>
        </Modal >
    )
}

export default MoveToBinModal;
