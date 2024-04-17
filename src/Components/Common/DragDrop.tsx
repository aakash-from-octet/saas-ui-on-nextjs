import React, { useEffect } from 'react';
import type { UploadProps } from 'antd';
import { message, Upload, Image, Button } from 'antd';
import { CLOUD_UPLOAD } from '../utils/image-constants';

const { Dragger } = Upload;




const DragDrop = ({ onUpload }: any) => {
    
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status, originFileObj } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                // Convert file to data URL and call onUpload
                const reader = new FileReader();
                reader.onload = (e) => onUpload(e.target.result);
                reader.readAsDataURL(originFileObj);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPEG/PNG file!');
            }
            return isJpgOrPng || Upload.LIST_IGNORE;
        },
    };

   
   
    return (



        <Dragger {...props} className='sign-modal-upload-outer'>
            <div className="ant-upload-drag-icon">
                <Image src={CLOUD_UPLOAD.src} alt="upload" preview={false} />
            </div>
            <p className="sign-modal-upload-text ant-upload-text">Drag & drop file here</p>
            <p className="sign-modal-upload-hint ant-upload-hint mb-16">
                Only .png &  .jpeg supported
            </p>
            <Button>Select Document</Button>
        </Dragger>
    )
};

export default DragDrop;

