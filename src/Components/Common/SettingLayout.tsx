import { ARROW_BACK, SETTINGS_APIS, SETTINGS_BIZSET, SETTINGS_CONTACTS, SETTINGS_INGRTN, SETTINGS_PROFILE, SETTINGS_SUBS, SETTINGS_SUPPORT, SETTINGS_TEAM_MEM, LOGOUT_PROFILE } from '@/Components/utils/image-constants';
import { DEV_BASE_URL } from '@/config';
import useVanityUrl from '@/hooks/vanityURL';
import { Row, Col, Image, Menu, Divider, notification } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

const SettingLayout = ({ children }) => {
    const router = useRouter();
    const [selectedKey, setSelectedKey] = useState(router.pathname.split('/').pop());
    const vanity = useVanityUrl
    (); 
    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
        router.push(`/${vanity}/${e.key}`);
        router.push(e.key);
    };
    const handleLogout = async () => {
        try {
            const token = sessionStorage.getItem("accessToken") || "";
            console.log(token, "tokennnn");
    
            const response = await axios.get(`${DEV_BASE_URL}/user/logout`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
    
            if (response.data.success === true) {
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('ProductdocumentId');
                notification.success({
                    message: "Success",
                    description: `${response.data.message}`,
                    placement: "bottomRight",
                    className: 'toast-primary',
                    duration: 2
                });
                router.push('/');
            } else {
                notification.error({
                    message: "Upload Failed",
                    description: `${response.data.message}`,
                    placement: "bottomRight",
                    className: 'toast-primary',
                    duration: 2
                });
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
   
    return (
        <div className='h-100vh bg-white'>
            <Row className='h-full'>
                <Col span={4}>
                    <div className="main-sidebar-settings gap-16 div-col">
                        <div className='div-row gap-8 p-16 align-center'>
                            <Image src={ARROW_BACK.src} className='cursor-pointer' alt="Logo" preview={false} onClick={() => router.push("/all-documents")} />
                            <p className='text-16 font-600'>Settings</p>
                        </div>


                        <Menu
                            mode="inline"
                            selectedKeys={[selectedKey]}
                            onClick={handleMenuClick}
                            className="sidebar-list sidebar-settings-list"
                        >
                        <Menu.Item key="profile">
                            <Link href={`/${vanity}/settings/profile`}>
                                <Image src={SETTINGS_PROFILE.src} alt="profile" height={20} width={20} preview={false} />
                                <span>Profile</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="contacts">
                            <Link href={`/${vanity}/settings/contacts`}>
                                <Image src={SETTINGS_CONTACTS.src} alt="contacts" height={20} width={20} preview={false} />
                                <span>Contacts</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="team-member">
                            <Link href={`/${vanity}/team-member`}>
                                <Image src={SETTINGS_TEAM_MEM.src} alt="team-member" height={20} width={20} preview={false} />
                                <span>Team member</span>
                            </Link>
                        </Menu.Item>
                        <Divider />
                        <Menu.Item key="subscription">
                            <Link href={`/${vanity}/subscription`}>
                                <Image src={SETTINGS_SUBS.src} alt="subscription" height={20} width={20} preview={false} />
                                <span>Subscription</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="business-setting">
                            <Link href={`/${vanity}/business-setting`}>
                                <Image src={SETTINGS_BIZSET.src} alt="business-setting" height={20} width={20} preview={false} />
                                <span>Business Setting</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="integration">
                            <Link href={`/${vanity}/integration`}>
                                <Image src={SETTINGS_INGRTN.src} alt="integration" height={20} width={20} preview={false} />
                                <div className='space-between w-full'>
                                    <span>Integration</span>
                                    <p className='setting-tag'>Go Pro</p>
                                </div>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="apis">
                            <Link href={`/${vanity}/apis`}>
                                <Image src={SETTINGS_APIS.src} alt="apis" height={20} width={20} preview={false} />
                                <div className='space-between w-full'>
                                    <span>APIs</span>
                                    <p className='setting-tag'>Coming soon</p>
                                </div>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="support">
                            <Link href={`/${vanity}/support`}>
                                <Image src={SETTINGS_SUPPORT.src} alt="support" height={20} width={20} preview={false} />
                                <span>Support</span>
                            </Link>
                        </Menu.Item>
                        <Divider className='m-0'/>
                        <div className='div-row p-16 align-center gap-8 cursor-pointer'>
                            
                                <Image src={LOGOUT_PROFILE.src} alt="support" height={20} width={20} preview={false} />
                                <span className='text-14 text-gray font-400' onClick={handleLogout}>Logout</span>
                            
                        </div>

                    </Menu>


                </div>
            </Col>
            <Col span={20}>
                <main>{children}</main>
            </Col>

        </Row>
        </div >
    )
}

export default SettingLayout;
