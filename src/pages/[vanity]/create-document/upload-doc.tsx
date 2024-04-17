import React, { useEffect, useRef, useState } from 'react'
import { Breadcrumb, Button, Col, Empty, Image, Row, Tabs, notification } from 'antd';
import { ARROW_BACK, BREADCRUMB_ARROW } from '@/Components/utils/image-constants';
import Link from 'next/link';
import ProductFileUploader from '@/Components/Common/ProductFileUploader';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadStatus } from '@/redux/action';
import useVanityUrl from '@/hooks/vanityURL';
const vanity = useVanityUrl(); 

const UploadDocument = () => {

    const router = useRouter();
  const[fileName,setfileName]=useState<any>("")
     const [isUploaded, setIsUploaded] = useState(false);
    const dispatch = useDispatch();

    const uploadPdf = async (file: any) => {
        const token: string = sessionStorage.getItem("token") || "";
    sessionStorage.setItem("fileName", file?.name)
   
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${DEV_BASE_URL}/document/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });
            console.log('response for uploadDoc,: ', response.data.documentId);
            sessionStorage.setItem("ProductdocumentId", response.data.documentId)
          
            dispatch(setUploadStatus(true));
            setfileName(file.name);
        } catch (error) {
            console.error('Error uploading document:', error);
            
        }
    };
useEffect(()=>{


    if (typeof window !== 'undefined' && fileName ){
      setfileName(fileName)
      
    }
  
    console.log(fileName)
},[fileName])

    return (
        <div className='bg-white h-100vh'>
            {/* header  */}
            <div className="p-header bg-white border-b space-between">
                <div className='div-row gap-12 align-center'>
                    <Image src={ARROW_BACK.src} alt="back" preview={false} className='cursor-pointer' onClick={() => router.push(`/all-documents`)} />
                    <p className='text-gray400 text-15 font-600'>{fileName ? fileName : "Untitled"}</p>
                </div>
                <Breadcrumb
                    className='create-doc-breadcrumb'
                    separator={<Image src={BREADCRUMB_ARROW.src} alt="back" preview={false} className='cursor-pointer justify-center' />
                    }
                    items={[
                        {
                            title: (<p className='bread-label bread-active div-row align-center'><span className='bread-num'>1</span>Upload</p>),
                            href: `#`
                        },
                        {
                            title: (<p className='bread-label bread-inactive '><span className='bread-num'>2</span>Add recipients</p>),
                            href: `/${vanity}/create-document/add-recipients` ,
                        },
                        {
                            title: (<p className='bread-label bread-inactive '><span className='bread-num'>3</span>Prepare</p>),
                            href: `/${vanity}/create-document/prepare-doc` ,
                        },
                    ]}
                />
                <div>
                    
                <Link className='justify-end' href={`/${vanity}/create-document/add-recipients` }>
                       <Button type="primary" className='w-fit'>Continue</Button>
                    </Link>
                 
                </div>
            </div>

            {/* main content */}
            <div className='justify-center'>
                <div className="product-container upload-outer-container">
                    <div className='py-10 div-col gap-24'>
                        <div className='div-col gap-6'>
                            <p className='text-gray text-18 font-600'>Upload document</p>
                            <p className='text-12 font-500 text-gray400'>Supported files: PDF, Word, PowerPoint, JPG, PNG</p>
                        </div>
                        {/* file uploader  */}
                        <div style={{ minHeight: '300px' }}>
                            <ProductFileUploader uploadDocument={uploadPdf} fileName={fileName}  />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default UploadDocument;
