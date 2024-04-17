import Link from 'next/link';
import { Table, Button, Dropdown, Menu, Image, Row, Col, Input, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import React, { useState } from 'react';
import Blank from '@/Components/Common/Blank';
import { TEMPLATE1 } from '@/Components/utils/image-constants';

export default function UploadDoc({ }) {
    const { TabPane } = Tabs;
    const onChange = (key) => {
        console.log(key);
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });


    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([

    ]);

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div>
            <svg width="64" height="43" viewBox="0 0 64 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.6667 25.1665H25.6667V34.8332C25.6667 35.3855 26.1144 35.8332 26.6667 35.8332H37.3333C37.8856 35.8332 38.3333 35.3855 38.3333 34.8332V25.1665H45.3333C45.7378 25.1665 46.1024 24.9229 46.2572 24.5492C46.412 24.1755 46.3264 23.7454 46.0404 23.4594L32.7071 10.1261C32.3166 9.73554 31.6834 9.73554 31.2929 10.1261L17.9596 23.4594C17.6736 23.7454 17.588 24.1755 17.7428 24.5492C17.8976 24.9229 18.2622 25.1665 18.6667 25.1665ZM50.6192 16.4414C50.7069 16.8827 51.0784 17.2111 51.5271 17.2438C57.9502 17.7132 63 22.9962 63 29.4998C63 31.1195 62.681 32.7233 62.0612 34.2196C61.4414 35.716 60.5329 37.0756 59.3876 38.2208C58.2424 39.3661 56.8828 40.2745 55.3864 40.8944C53.8901 41.5142 52.2863 41.8332 50.6667 41.8332H16C12.0218 41.8332 8.20644 40.2528 5.3934 37.4398C2.58035 34.6267 1 30.8114 1 26.8332L1 26.8329C0.998938 23.1342 2.3635 19.5653 4.83194 16.8108C7.30038 14.0563 10.6989 12.3101 14.3756 11.9072C14.7069 11.8709 14.9983 11.672 15.1528 11.3766C18.3208 5.31945 24.6807 1.16651 32 1.16651L32.0005 1.16651C36.3922 1.16435 40.6487 2.68577 44.044 5.47131C47.4393 8.25683 49.7631 12.134 50.6192 16.4414Z" fill="#D0D3D9" stroke="#A2A7B3" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div style={{
                marginTop: 0,
                marginBottom: 20
            }}>
                <p>
                    Drag & drop file here
                </p>
                <p>
                    Supported files: PDF, Word, PowerPoint, JPG, PNG
                </p>
            </div>

            <Button>Select Document</Button>
        </div>
    );
    return (
        <Blank>
            <div className='b-header'>
                <Row justify="space-between" align='middle'>
                    <Col>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11V13ZM5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13L5 11ZM19 11L5 11L5 13L19 13V11Z" fill="#4E5461" />
                            <path d="M10.2929 18.7071C10.6834 19.0976 11.3166 19.0976 11.7071 18.7071C12.0976 18.3166 12.0976 17.6834 11.7071 17.2929L10.2929 18.7071ZM5 12L4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071L5 12ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L11.7071 6.70711ZM11.7071 17.2929L5.70711 11.2929L4.29289 12.7071L10.2929 18.7071L11.7071 17.2929ZM5.70711 12.7071L11.7071 6.70711L10.2929 5.29289L4.29289 11.2929L5.70711 12.7071Z" fill="#4E5461" />
                        </svg>
                    </Col>
                    <Col>
                        <ul className='doc-main-tab'>
                            <li className='active'>
                                <Link href="/upload"><p><span>1</span>Upload</p></Link>
                            </li>
                            <li>
                                <Link href="/add-recipients"><p><span>2</span>Add recipients</p></Link>
                            </li>
                            <li>
                                <Link href="#"><p><span>3</span>Prepare</p></Link>
                            </li>
                        </ul>
                    </Col>
                    <Col>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 18L6 6" stroke="#4E5461" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18 6L6 18" stroke="#4E5461" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Col>
                </Row>
            </div>
            <div className='b-body'>
                <Row>
                    <Col span={16} offset={4}>
                        <Tabs defaultActiveKey="1" onChange={onChange}>
                            <TabPane tab="Upload" key="1">
                                <div>
                                    <h3 className='title-1 mb-0'>Upload document</h3>
                                    <p className='title-2'>lorem ipusm</p>
                                </div>
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}

                                </Upload>
                                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </TabPane>
                            <TabPane tab="Templates" key="2">
                                <Row justify="space-between" align='middle'>
                                    <Col>
                                        <h3 className='title-1 mb-0'>Use Template</h3>
                                        <p className='title-2'>Use templates to make faster workflow</p>
                                    </Col>
                                    <Col>
                                        <Button type="primary" size="large">Create Template</Button>
                                    </Col>
                                </Row>
                                <div className='template-grid'>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                    <div>
                                        <figure>
                                            <Image src={TEMPLATE1.src} preview={false}></Image>
                                            <figcaption>
                                                <Button type='primary'>Use Template</Button>
                                            </figcaption>
                                        </figure>
                                        <h4 className='title-3 mb-0'>Octet Design NDA</h4>
                                        <h6 className='title-4'>3 March, 2022</h6>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

            </div>
        </Blank>
    )
}