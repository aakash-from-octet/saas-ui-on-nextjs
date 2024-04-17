
import Link from 'next/link';
import { Table, Button, Dropdown, Menu, Image, Row, Col, Input, Tabs } from 'antd';
import Blank from '@/Components/Common/Blank';
import { useEffect } from 'react';


export default function AddRecipients({ }) {
    const { TabPane } = Tabs;
    
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
                            <li className='active'>
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
                        <Row>
                            <Col>
                                <h3 className='title-1 mb-0'>Add recipients</h3>
                                <p className='title-2'>Some copy for give more infomation to the user</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Tabs tabPosition="left">
                                    <TabPane tab={
                                        <div className='align-center'>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.1665 13.5229C16.1085 13.9805 17.4998 15.2153 17.4998 16.6666" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 16.6668C2.5 14.8259 4.73858 13.3335 7.5 13.3335C10.2614 13.3335 12.5 14.8259 12.5 16.6668" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12.5 10.8332C14.3409 10.8332 15.8333 9.34079 15.8333 7.49984C15.8333 5.65889 14.3409 4.1665 12.5 4.1665" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M7.49984 10.8332C9.34079 10.8332 10.8332 9.34079 10.8332 7.49984C10.8332 5.65889 9.34079 4.1665 7.49984 4.1665C5.65889 4.1665 4.1665 5.65889 4.1665 7.49984C4.1665 9.34079 5.65889 10.8332 7.49984 10.8332Z" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>

                                            Me & others
                                        </div>
                                    } key="1">
                                        Content of Tab 1
                                    </TabPane>
                                    <TabPane tab={
                                        <div className='align-center'>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.8335 16.6665C5.8335 15.2858 7.69898 14.1665 10.0002 14.1665C12.3013 14.1665 14.1668 15.2858 14.1668 16.6665" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15 11.8745C16.4716 12.2603 17.5 13.1413 17.5 14.1665" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M5 11.8745C3.52841 12.2603 2.5 13.1413 2.5 14.1665" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M10 11.6665C11.3807 11.6665 12.5 10.5472 12.5 9.1665C12.5 7.78579 11.3807 6.6665 10 6.6665C8.61929 6.6665 7.5 7.78579 7.5 9.1665C7.5 10.5472 8.61929 11.6665 10 11.6665Z" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14.9998 8.52993C15.5113 8.07216 15.8332 7.40692 15.8332 6.6665C15.8332 5.28579 14.7139 4.1665 13.3332 4.1665C12.6929 4.1665 12.1088 4.40722 11.6665 4.80308" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M4.99984 8.52993C4.48838 8.07216 4.1665 7.40692 4.1665 6.6665C4.1665 5.28579 5.28579 4.1665 6.6665 4.1665C7.3068 4.1665 7.89087 4.40722 8.33317 4.80308" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Other only
                                        </div>
                                    } key="2">
                                        Content of Tab 2
                                    </TabPane>
                                    <TabPane tab={
                                        <div className='align-center'>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.1665 17.4998C4.1665 14.2782 6.77818 11.6665 9.99984 11.6665C13.2215 11.6665 15.8332 14.2782 15.8332 17.4998" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M9.99984 9.16667C11.8408 9.16667 13.3332 7.67428 13.3332 5.83333C13.3332 3.99238 11.8408 2.5 9.99984 2.5C8.15889 2.5 6.6665 3.99238 6.6665 5.83333C6.6665 7.67428 8.15889 9.16667 9.99984 9.16667Z" stroke="#4277FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>

                                            Me only
                                        </div>
                                    } key="3">
                                        Content of Tab 3
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Blank>
    )
}