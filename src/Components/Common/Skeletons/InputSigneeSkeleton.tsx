import { Col, Row, Skeleton } from 'antd'
import React from 'react'

const InputSigneeSkeleton = ({ label }: { label?: boolean; }) => {
    return (
        <Row gutter={[12, 12]}>
            <Col sm={8}>
                <div className="div-col gap-8 lh-16">
                    {label && <Skeleton.Input active={true} className='skeleton-h10' size='small' />}
                    <Skeleton.Input active={true} className='skeleton-h40' block={true} />
                </div>
            </Col>
            <Col sm={16}>
                <div className="div-col gap-8 lh-16">
                    {label && <Skeleton.Input active={true} className='skeleton-h10' size='small' />}
                    <Skeleton.Input active={true} className='skeleton-h40' block={true} />
                </div>
            </Col>
        </Row>
    )
}

export default InputSigneeSkeleton;
