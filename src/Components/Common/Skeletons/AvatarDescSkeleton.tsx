import { Skeleton } from 'antd'
import React from 'react'

const AvatarDescSkeleton = () => {
    return (
        <div className='div-row gap-6'>
            <Skeleton.Avatar active={true} size={'default'} shape={'circle'} />
            <Skeleton.Button active={true} size={'default'} block={true} style={{ width: '100px' }} />
        </div>
    )
}

export default AvatarDescSkeleton;
