import { Divider, Skeleton } from 'antd';
import React from 'react';

const ProfileSkeleton = () => {
    return (
        <div className='bg-white'>
            <div className='div-col'>
                <Skeleton.Button active={true} className='p-16' size={'large'} block={false} />

                <div className="p-32 div-col gap-32">
                    <Skeleton.Button active={true} size={'default'} block={true} className='mw-110' />
                    <Skeleton.Image active={true} style={{ borderRadius: 100 }} />

                    <div className='div-col gap-24'>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className='div-col gap-12' style={{ maxWidth: '320px' }}>
                                <Skeleton.Button active={true} size={'small'} style={{ width: '100px' }} />
                                <Skeleton.Button active={true} size={'default'} block={true} />
                            </div>
                        ))}
                        <Divider />
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ProfileSkeleton;

