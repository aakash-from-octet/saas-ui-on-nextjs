import { Button, Dropdown, Image, MenuProps, notification } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { DOT, HOME_ICON, LOGO, REMINDER_BELL } from '@/Components/utils/image-constants';
import SendReminderModal from '@/Components/Modal/SendReminder';
import MoveToBinModal from '@/Components/Modal/MoveToBinModal';
import CancelDocModal from '@/Components/Modal/CancelDocModal';
import SendDocModal from '@/Components/Modal/SendDocModal';
import DocumentNameModal from '@/Components/Modal/DocumentNameModal';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';

const NavbarDocDetails = () => {

    const [reminderModal, setReminderModal] = useState(false);
    const [movetobinModal, setMovetobinModal] = useState(false);
    const [cancelDocModal, setCancelDocModal] = useState(false);
    const [isSendDocModal, setIsSendDocModal] = useState(false);
    const [isDocNameModal, setIsDocNameModal] = useState(false);
    const [docIdLoading, setDocIdLoading] = useState<boolean>(true);
    const [docId, setdocId] = useState<any>("")
    const[signerEmail,setSignerEmail]=useState<any>("")
    const[fileName,setfileName]=useState<any>("")
    useEffect(() => {
        let documentId,fileName, signerEmail: any;
        setDocIdLoading(true);
        if (typeof window !== 'undefined') {
            documentId = sessionStorage.getItem('ProductdocumentId') || "";
            setdocId(documentId);
            signerEmail = sessionStorage.getItem('signerEmail') || "";
            setSignerEmail(signerEmail);
            fileName = sessionStorage.getItem('fileName') || "";
            setfileName(fileName);

        }
        setDocIdLoading(false);
    }, []);

    const Rename = async () => {
        try {
          const token = sessionStorage.getItem("accessToken") || "";
          const request = {
            documentId: docId,
            data: {
              documentStatus: "Draft",
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
           
            notification.success({
              message: "Success",
              description: "Document Saved as Draft.",
              placement: "bottomRight",
              className: "toast-primary",
              duration: 2,
            });
    
          } else {
            notification.error({
              message: "Error",
              description: "Failed to Save the Document.",
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

    const items: MenuProps['items'] = [
        {
            label: 'Edit Settings',
            key: '1',
            onClick: () => setIsSendDocModal(true),
        },
        {
            label: 'Rename',
            key: '2',
            onClick: () => setIsDocNameModal(true),
        },
        {
            label: 'Download PDF',
            key: '3',
        },
        {
            label: 'Audit Trail',
            key: '4',
        },
        {
            label: 'Move to Bin',
            key: '5',
            onClick: () => setMovetobinModal(true),
        },
        {
            label: 'Cancel Document',
            key: '6',
            onClick: () => setCancelDocModal(true),

        },
    ];

    return (
        <>
            <div className='navbar-outer'>
                <div className='space-between gap-10'>
                    <div className='div-row gap-12 align-center'>
                        <Link href={'/all-documents'}>
                            <Image src={HOME_ICON.src} alt="home" preview={false} />
                        </Link>
                        <p className='text-18 font-600'>{fileName ? fileName : "Non-Disclosure Agreement"}</p>
                    </div>


                    <div className='div-row gap-12 align-center'>
                        <Button className='btn-with-lefticon dark-btn'
                            onClick={() => setReminderModal(true)}
                            icon={<Image src={REMINDER_BELL.src} alt="bell" preview={false} />}>
                            Send Reminder
                        </Button>
                        <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-square" placement="bottomRight">
                            <Image src={DOT.src} alt="Logo" height={32} width={32} preview={false} />
                        </Dropdown>
                    </div>
                </div>
            </div>

            <DocumentNameModal
                isDocNameModal={isDocNameModal}
                setIsDocNameModal={setIsDocNameModal}
                isUpdate={true}
            />
            <SendReminderModal
                reminderModal={reminderModal}
                setReminderModal={setReminderModal}
            />
            <MoveToBinModal
                movetobinModal={movetobinModal}
                setMovetobinModal={setMovetobinModal}
            />
            <CancelDocModal
                cancelDocModal={cancelDocModal}
                setCancelDocModal={setCancelDocModal}
            />
            <SendDocModal
                docName={'SANJEEVANI DOC'}
                documentId={'SOMETGING HERE'}
                isSendDocModal={isSendDocModal}
                setIsSendDocModal={setIsSendDocModal}
                mailData={[]}
                isUpdate={true}
            />
        </>
    )
}

export default NavbarDocDetails;
