import { Button, Image, Input, Modal, Spin, notification } from 'antd'
import React, { useEffect, useState } from 'react';
import { MODAL_CLOSE_SM } from '@/Components/utils/image-constants';
import SendDocModal from './SendDocModal';
import axios from 'axios';
import { DEV_BASE_URL } from '@/config';
const DocumentNameModal = ({ isUpdate, isDocNameModal, setIsDocNameModal }: { isUpdate?: boolean; isDocNameModal?: any; setIsDocNameModal?: any }) => {
    const [mailData, setMailData] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [docIdLoading, setDocIdLoading] = useState<boolean>(true);
    const [docName, setdocName] = useState<any>("")
    const [docId, setdocId] = useState<any>("")

    const Rename = async () => {
        try {
          const token = sessionStorage.getItem("accessToken") || "";
          const request = {
            documentId: docId,
            data: {
                fileName: docName,
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
            sessionStorage.setItem('fileName',docName) 
            setIsDocNameModal(false);
            notification.success({
              message: "Success",
              description: "Document Renamed Successfully",
              placement: "bottomRight",
              className: "toast-primary",
              duration: 2,
            });
    
          } else {
            notification.error({
              message: "Error",
              description: "Failed to Rename the Document.",
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

  
    const handleCancel = () => {
        setIsDocNameModal(false);
    };

    useEffect(() => {
        let documentId, fileName: any;
        setDocIdLoading(true);
        if (typeof window !== 'undefined') {
            documentId = sessionStorage.getItem('ProductdocumentId') || "";
            setdocId(documentId);
            fileName = sessionStorage.getItem('fileName') || "";
            setdocName(fileName);
        }
        setDocIdLoading(false);
    }, []);

    const fetchDocumentData = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("accessToken") || "";
            const response = await axios.post(`${DEV_BASE_URL}/document/details`, { documentId: docId }, {
                headers: {
                    Authorization: ` ${token}`,
                },
            });
            if (response.data.success == true) {
                console.log(response.data.documentSignerDetails);
                setMailData(response.data.documentSignerDetails);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (docId) {
            fetchDocumentData();
        }
    }, [docId]);


    if (docIdLoading && loading) {
        <Spin />
    }
    return (
        <>
            <Modal
                width={370}
                centered
                maskClosable={true}
                className="m-double-header modal-topclose"
                open={isDocNameModal}
                footer={null}
                closeIcon={<Image src={MODAL_CLOSE_SM.src} className='' preview={false} alt="modal-close" onClick={handleCancel} />}
                title={<p className='text-p text-16 font-600'>{isUpdate ? 'Edit Document Name' : 'Document Name'}</p>}
            >
                <div className='div-col gap-24 mt-20 align-end'>
                    <Input
                        placeholder='Document Name'
                        value={docName}
                        onChange={(e) => setdocName(e.target.value)} 
                        className='modal-input'
                    />
                    <Button type='primary' size='large' className='w-fit' onClick={Rename}>Save & Continue</Button>
                </div>
            </Modal>

        </>
    )
}
export default DocumentNameModal;
