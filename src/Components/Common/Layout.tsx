import Link from 'next/link'
import { Col, Row, Image, Menu, Progress, Button, Badge } from 'antd';
import { LOGO, NOTIFICATION, SIDE_ALLDOC, SIDE_BIN, SIDE_CANCELLED, SIDE_COMPLETED, SIDE_DRAFT, SIDE_DRIVE, SIDE_INPROGRESS, SIDE_SETTINGS, SIDE_SIGN, SIDE_TEMPLATES } from '@/Components/utils/image-constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setSelectedStatus } from '@/redux/action';
import useVanityUrl from '@/hooks/vanityURL';
export default function Layout({ children,needToSignCount }:any) {
    const router = useRouter();
    const [selectedKey, setSelectedKey] = useState(router.pathname.split('/').pop());
    const dispatch = useDispatch();
    const vanity = useVanityUrl(); 
    const handleMenuClick = (e:any) => {
        setSelectedKey(e.key);
        router.push(`/${vanity}/${e.key}`);
        dispatch(setSelectedStatus(e.key)); 
    };


    return (
        <>
            <Row>
                <Col span={4}>
                    <div className="main-sidebar">
                        <Row align='middle' justify='space-between' className='sidebar-logo'>
                            <Col>
                                <Link href={'/'} className='w-fit'>
                                    <Image src={LOGO.src} alt="Logo" height={26} width={118} preview={false} />
                                </Link>
                            </Col>
                            {/* <Col>
                                <Link href="/notifications" >
                                    <Badge count={3} size='small' className='sidebar-noti-count' offset={[-2, 2]}>
                                        <Image src={NOTIFICATION.src} className='img-notification-bell' alt="notification" height={28} width={28} preview={false} />
                                    </Badge>
                                </Link>
                            </Col> */}
                        </Row>


                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            onClick={handleMenuClick}
                            className="sidebar-list"
                        >
                            <Menu.Item key="all-documents">
                                <Link href={`/${vanity}/all-documents`}>
                                    {/* <a> */}
                                    <Image src={SIDE_ALLDOC.src} alt="all documents" height={20} width={20} preview={false} />
                                    <span>All Documents</span>
                                    {/* </a> */}
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="draft">
                                <Link href={`/${vanity}/draft`}>
                                    {/* <a> */}
                                    <Image src={SIDE_DRAFT.src} alt="draft" height={20} width={20} preview={false} />
                                    <span>Draft</span>
                                    {/* </a> */}
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="in-progress">
                                <Link href={`/${vanity}/in-progress`}>
                                    {/* <a> */}
                                    <Image src={SIDE_INPROGRESS.src} alt="inprogress" height={20} width={20} preview={false} />
                                    <span>In Progress</span>
                                    {/* </a> */}
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="need-to-sign">
                                <Link href={`/${vanity}/need-to-sign`}>
                                    {/* <a> */}
                                    <Image src={SIDE_SIGN.src} alt="sign" height={20} width={20} preview={false} />
                                    <p className='w-full space-between'>
                                        <span>I need to sign</span>
                                        {  needToSignCount>=1 && <span className='docu-status-num'>{needToSignCount}</span>}
                                    </p>

                                    {/* </a> */}
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="completed">
                                <Link href="{`/${vanity}/completed`}">
                                    {/* <a> */}
                                    <Image src={SIDE_COMPLETED.src} alt="completed" height={20} width={20} preview={false} />
                                    <span>Completed</span>
                                    {/* </a> */}
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="cancelled">
                                <Link href={`/${vanity}/cancelled`}>
                                    {/* <a> */}
                                    <Image src={SIDE_CANCELLED.src} alt="cancelled" height={20} width={20} preview={false} />
                                    <span>Cancelled</span>
                                    {/* </a> */}
                                </Link>

                            </Menu.Item>
                            <Menu.Item key="bin">
                                <Link href="{`/${vanity}/bin`}">
                                    {/* <a> */}
                                    <Image src={SIDE_BIN.src} alt="bin" height={20} width={20} preview={false} />
                                    <span>Bin</span>
                                    {/* </a> */}
                                </Link>
                            </Menu.Item>
                            <hr />
                            {/* <Menu.Item key="templates">
                                <Image src={SIDE_TEMPLATES.src} alt="templates" height={20} width={20} preview={false} />
                                <span>Templates</span>
                            </Menu.Item> */}
                            {/* <hr />
                            <Menu.Item key="drive">
                                <Image src={SIDE_DRIVE.src} alt="drive" height={20} width={20} preview={false} />
                                <span>My drive</span>
                            </Menu.Item> */}
                        </Menu>

                        <div className='sidebarBottom'>
                            <hr />
                            {/* <Row justify='center' className='text-center sidebar-bottominfo'>
                                <Col span={20}>
                                    <p className='text-12 text-gray font-500 mb-0'>3 credit left</p>
                                    <Progress percent={30} showInfo={false} size="small" strokeColor="#54C093" />
                                    <Button type="text" className='text-12 font-500'>Buy more</Button>
                                </Col>
                            </Row>
                            <hr /> */}
                            <Row>
                                <Col span={24}>
                                    <Menu mode="inline" className="sidebar-list">
                                        <Menu.Item key="settings">
                                            <Link href={`/${vanity}/settings/profile`}> <Image src={SIDE_SETTINGS.src} alt="settings" height={20} width={20} preview={false} />
                                                <span>Settings </span>
                                            </Link>
                                        </Menu.Item>
                                    </Menu>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
                <Col span={20}>
                    <main>{children}</main>
                </Col>
            </Row>
        </>
    )
}

