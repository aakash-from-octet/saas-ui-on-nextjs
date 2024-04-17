import SettingLayout from '@/Components/Common/SettingLayout';
import { DOT } from '@/Components/utils/image-constants';
import { Button, Dropdown, Image, Menu, Spin, Table, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import AddContactModal from '@/Components/Modal/AddContactModal';
import EditContactModal from '@/Components/Modal/EditContactModal';
import axios from 'axios';
import { DEV_BASE_URL } from '@/config';
import ContactsSkeleton from '@/Components/Common/Skeletons/ContactsSkeleton';
import useVanityUrl from '@/hooks/vanityURL';


const SettingContacts = () => {
    const [User, setUser] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const vanity = useVanityUrl(); 
    const getContact = async () => {
        try {
            setLoading(true)
            const token = sessionStorage.getItem("accessToken") || "";
            const response = await axios.get(`${DEV_BASE_URL}/contact/`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.data.success === true) {
                console.log(response.data.contacts,"contact");

                setUser(response.data.contacts);
             
                setLoading(false)
            }

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {


        getContact();
    }, []);
    const deleteUser = async (email: string) => {
        try {
            const token = sessionStorage.getItem("accessToken") || "";
            const response = await axios.delete(`${DEV_BASE_URL}/contact/delete`, {
                headers: {
                    Authorization: `${token}`,
                },
                data: { email },
            });

            if (response.data.success === true) {
                notification.success({
                    message: 'Succss!',
                    description: `Contact Successfully Deleted.`,
                    duration: 1,
                    placement: "bottomRight",
                    className: 'toast-primary',
                });
                getContact();
            }
            else {
                notification.error({
                    message: 'Error!',
                    description: `not working`,
                    duration: 1,
                    placement: "bottomRight",
                    className: 'toast-primary',
                });

            }
        } catch (error) {
            console.error(error);
        }
    };
    const user_img = 'https://rb.gy/8n7icm'



    const columns = [
        {
            title: 'Name',
            // dataIndex: 'name',
            key: 'username',
            render: (record) => {
                console.log(record,"name")
                return (
                    <div className='div-col gap-4'>
                    <p className='text-gray font-400 text-capital text-14'>{record?.name}</p>
                    <p className='text-10 font-500 text-gray'>{record?.documentCount}{' '}Documents</p>
                </div>
                    )
            },
            width: '30%'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => {
                return (
                    <p className='text-12 font-500 text-gray'>{email}</p>
                )
            },
            width: '30%'
        },
        {
            title: 'Last document',
            dataIndex: 'last_doc',
            key: 'last_doc',
            render: last_doc => {
                return <p className='text-gray400 text-12 font-400'>1 week</p>
            },
            width: '20%'
        },
        {
            title: ' ',
            key: 'action',
            render: (record) => {
                const menuLast: MenuProps['items'] = [
                    {
                        key: '1',
                        label: (
                            <EditContactModal getContact={getContact} />
                        ),
                    },
                    {
                        key: '2',
                        label: (

                            <p className='text-12 font-500 text-gray' >Delete</p>
                        ),
                        onClick: () => deleteUser(record.email),
                    },
                ];
                return (
                    <div className='div-row gap-12 justify-center align-center'>
                        <Link href={`/${vanity}/all-documents`}><Button className='gray-btn'>See Document</Button></Link>
                        <Dropdown menu={{ items: menuLast }} trigger={['click']} placement="bottomLeft">
                            <Image src={DOT.src} alt="Options" height={24} width={24} preview={false} className='cursor-pointer' />
                        </Dropdown>
                    </div>
                )
            },
            width: '20%'
        },
    ];


    return (
        <SettingLayout>
            {loading ? (<ContactsSkeleton />) : (
                <div className='bg-h'>
                    {/* contacts header */}
                    <div className='space-between contacts-header'>
                        <p className='text-gray text-18 font-600'>Contact</p>
                        <AddContactModal getContact={getContact} />
                    </div>

                    {/* contacts main */}
                    <div className='settings-contacts-outer'>
                        <Table dataSource={User} columns={columns} pagination={false} className="table-1" />
                    </div>
                </div>
            )}
        </SettingLayout>
    )
}

export default SettingContacts;


