import React from 'react';
import { Button, Col, Empty, Image, Row } from 'antd';
import { ARROW_BACK, NOTI_CANCELLED, NOTI_COMPLETED, NOTI_CREDIT, NOTI_SIGNDOC } from '@/Components/utils/image-constants';
import { useRouter } from 'next/router';


const notificationsData = [
    {
        id: 1, title: 'You have Zomato audit contract in I need to sign section.',
        status: 'unread',
        type: 'sign',
        timestamp: 'Just now',
        buttonType: 'Sign now'
    },
    {
        id: 2,
        title: 'NDA_Octet_studio is completed.',
        status: 'read',
        type: 'completed',
        timestamp: '3 days ago',
        buttonType: 'Download PDF'
    },
    {
        id: 3,
        title: 'Max life finance agreement have been cancelled.',
        status: 'read',
        type: 'cancelled',
        timestamp: '5 days ago',
        buttonType: 'Sign now'
    },
    {
        id: 4,
        title: 'Your credits about to end.',
        status: 'read',
        type: 'credits',
        timestamp: '1 month ago',
        buttonType: 'Buy more'
    },
    {
        id: 5,
        title: 'You have Zomato audit contract in I need to sign section.',
        status: 'read',
        type: 'sign',
        timestamp: '1 month ago',
        buttonType: 'Sign now'
    },
]



const NotificationPage = () => {
    const router = useRouter();


    // Function to determine the image source based on notification type
    const getImageSrc = (type) => {
        switch (type) {
            case 'sign':
                return NOTI_SIGNDOC.src;
            case 'cancelled':
                return NOTI_CANCELLED.src;
            case 'completed':
                return NOTI_COMPLETED.src;
            default:
                return NOTI_CREDIT.src;
        }
    };




    return (
        <div className='bg-white h-100vh'>

            {/* header  */}
            <div className="p-header border-b div-row gap-12 align-center">
                <Image src={ARROW_BACK.src} alt="back" preview={false} className='cursor-pointer' onClick={() => router.back()} />
                <p className='text-gray text-16 font-600'>Notification</p>
            </div>


            {/* body - notification   */}
            <div className='justify-center align-start'>

                <div className={`notification-inner-container ${notificationsData.length > 0 ? 'align-end' : 'align-center'}`}>
                    {notificationsData.length > 0 && (
                        <Button className='w-fit' onClick={() => alert('Add the required functionality')}>Mark as read</Button>
                    )}

                    {/* all notifications  */}
                    <Row justify='center' align='middle'>
                        {Array.isArray(notificationsData) ? (notificationsData.length > 0) ?
                            (notificationsData?.map((notification: any) => {
                                return (

                                    <Col span={24} className='notification-border' key={notification.id} >
                                        <div className={`space-between gap-20 notification-outer-details ${notification.status == 'unread' ? 'bg-unread' : 'bg-read'}`}>
                                            <div className='div-row align-center gap-16'>
                                                <Image src={getImageSrc(notification.type)} alt="back" preview={false} height={36} width={36} className='img-36' />
                                                <div className='notification-details-texts'>
                                                    <p>{notification.title}</p>
                                                    <Button type='text' onClick={() => alert('Add the required functionality')}>{notification.buttonType}</Button>
                                                </div>
                                            </div>
                                            <p className='notification-timestamp text-end text-12 lh-20 font-400 text-gray400'>
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                    </Col>

                                )
                            })) :
                            (<div className='justify-center h-full'>
                                <Empty description={(<p className='text-gray text-14 font-600'>No Notifications Yet!</p>)} />
                            </div>
                            ) : null}

                    </Row>
                </div>



            </div>

        </div>

    )
}

export default NotificationPage;