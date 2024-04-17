import React from 'react';
import { Button, Image, Modal } from 'antd';
import { REMINDER_ICON, } from '@/Components/utils/image-constants';


const SendReminderModal = ({ reminderModal, setReminderModal }: { reminderModal?: any; setReminderModal?: any; }) => {

    const handleCancel = () => {
        setReminderModal(false);
    };

    const handleOk = () => {
        setReminderModal(false);
    };

    return (
        <Modal
            title={null}
            width={394}
            maskClosable={true}
            className="alert-modal"
            open={reminderModal}
            footer={null}
            closeIcon={null}
        >
            <div className='alert-modal-content'>
                <div className='alert-modal-img br-8'>
                    <Image src={REMINDER_ICON.src} preview={false} alt="alert" width={67} height={75} />
                </div>
                <div className='text-center alert-modal-details px-2'>
                    <p>Send Reminder</p>
                    <p className='font-400'>Are you sure you want to send a reminder to the signees?</p>
                </div>
                <div className='space-between gap-20 alert-modal-footer'>
                    <Button size="large" block className='h-45' onClick={handleCancel}>Cancel</Button>
                    <Button size="large" block type='primary' className='h-45' onClick={handleOk}>Yes, Remind</Button>
                </div>
            </div>
        </Modal >
    )
}

export default SendReminderModal;
