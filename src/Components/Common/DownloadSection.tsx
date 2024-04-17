import { Button, Divider, Input } from 'antd'
import React from 'react'

const DownloadSection = () => {
    const email = 'aakash@octet.design';
    return (
        <div className='p-20 download-section-outer div-col gap-20'>
            <div className='div-col gap-8 download-section-header'>
                <p className='text-18 font-600 text-p'>Document Signed successfuly</p>
                <p className='text-12 font-400 text-gray lh-20'>Save your document safely and access it anytime.<br /> Please Create an account.</p>
            </div>
            <Input size='large' className='modal-input' value={email} readOnly />
            <Button size='large' type='primary' block>Create Account</Button>
            <Divider className='mx-10 h-divider' />
            <div className='space-between my-n10'>
                <p className='text-14 font-500 text-black'>Download Signed Document</p>
                <Button size='large'>Download PDF</Button>
            </div>
            <Divider className='mx-10 h-divider' />
            <div className='space-between my-n10'>
                <p className='text-14 font-500 text-black'>Sign another Document?</p>
                <Button type='text' className='p-0 font-600'>Upload New Document</Button>
            </div>
        </div>
    )
}

export default DownloadSection