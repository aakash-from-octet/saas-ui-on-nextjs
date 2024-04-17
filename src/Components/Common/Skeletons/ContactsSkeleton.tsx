import { Divider, Skeleton } from 'antd';
import React from 'react'

const ContactsSkeleton = () => {
    return (
        <div className='bg-white div-col gap-12'>
            <div className='space-between contacts-header'>
                <Skeleton.Button active={true} size={'default'} block={false} />
                <Skeleton.Button active={true} size={'default'} block={false} />
            </div>

            <div className='p-32'>
                <div className='div-row mb-20 w-full'>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} style={{ width: '30%' }}>
                            <Skeleton.Button active={true} size={'small'} block={false} style={{ width: '100px' }} />
                        </div>
                    ))}
                    <div style={{ width: '10%' }} />
                </div>
                <Divider className='m-0' />

                {/* table columns  */}

                <div className='div-col gap-10 mt-16'>
                    {[...Array(2)].map((_, index) => (
                        <div className='py-10 div-row w-full' key={index}>
                            <div className='div-row align-center gap-8' style={{ width: '30%' }}>
                                <Skeleton.Avatar active={true} size={'default'} shape={'circle'} />
                                <Skeleton.Button active={true} size={'small'} block={false} style={{ width: '100px' }} />
                            </div>
                            {[...Array(2)].map((_, index) => (
                                <div key={index} style={{ width: '30%' }}>
                                    <Skeleton.Button active={true} size={'small'} block={false} style={{ width: '100px' }} />
                                </div>
                            ))}
                            <Skeleton.Button active={true} size={'small'} block={false} style={{ width: '100px' }} />

                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default ContactsSkeleton;
