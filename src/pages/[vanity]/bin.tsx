import Link from 'next/link';
import { Table, Button, Dropdown, Menu, Image, Row, Col, Input, MenuProps, Tabs, Tooltip } from 'antd';
import Layout from '@/Components/Common/Layout';
import { DOT, FOLDER, NODOC, TEMPLATE_BIN } from '@/Components/utils/image-constants';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';
import moment from 'moment';
const { TabPane } = Tabs;


export default function AllDocuments({ }) {
    const [activeKey, setActiveKey] = useState("1");
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<any>([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const selectedStatus = useSelector((state: any) => state?.selectedStatus);

    console.log(selectedStatus, "state")
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };
      console.log(selectedStatus, "state")
      const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
          const token = sessionStorage.getItem("accessToken") || "";
          let status = selectedStatus === "bin" && "Archived" ;
          let url = `${DEV_BASE_URL}/document/search?${status ? `&status=${status}` : ''}`;
          
          const response = await axios.get(url, {
            headers: {
              Authorization: `${token}`,
            },
          });
    
          if (response.data.success) {
            const newDataSource = response.data?.documents?.map((item) => ({
              key: item._id,
              document: item.fileName,
              status: item.documentStatus,
              changes: item.updatedAt,
              action: "",
            }));
            setDataSource(newDataSource)
            setFilteredDataSource(newDataSource)
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        } finally {
          setLoading(false);
        }
      }, [ selectedStatus]);
    
      useEffect(() => {
        const debouncedFetch = debounce(() => fetchDocuments(), 400);
        debouncedFetch();
      }, [fetchDocuments]);
    
    
    
    const EmptyPart: any = () => {
        return (
            <div className="div-col align-center no-document">
                <Image
                    src={NODOC.src}
                    preview={false}
                    alt="no-doc"
                    width={64}
                    className="mb-12"
                />
                <p className="text-gray text-16 font-600 mb-6">No documents</p>
                <p className="text-12 font-500 text-gray400 text-center">
                    Once a document is create,
                    <br />
                    it will be listed here.
                </p>
            </div>
        );
    };
    const columns = [
        {
            title: 'Document',
            dataIndex: 'document',
            key: 'document',
            render: document => {
                return <>
                    <h3>{document}</h3>
                    <p>{document}</p>
                </>
            },
            width: '50%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                if (status == "Draft") {
                    return <p className="doc-tag purple-tag">{status}</p>
                }
                else if (status == "Cancelled") {
                    return (
                        <p className="doc-tag orange-tag">{status}</p>
                    );
                } else if (status == "Inprogress") {
                    return (
                        <p className="doc-tag yellow-tag">{status}</p>
                    );
                } else if (status == "I need to sign") {
                    return (
                        <p className="doc-tag blue-sign"> {status}</p>
                    );
                }
                else if (status == "Completed") {
                    return (
                        <p className="doc-tag green-tag">{status}</p>
                    );
                }
                else if (status == "Archived") {
                    return (
                        <p className="doc-tag gray-tag">{status}</p>
                    );
                }
            },
            width: '18%'
        },
        {
            title: 'Last changes',
            dataIndex: 'changes',
            key: 'changes',
            render: (changes) => {
                return (<Tooltip title={<p>{moment(changes).format("MMMM Do, YYYY [at] h:mm A")}</p>} placement="bottom" overlayClassName='primary-tooltip' trigger={'hover'} >
                    <p className="text-gray font-500 w-fit">{moment(changes).format('MMMM Do, YYYY')}</p>
                </Tooltip>)
            },
            width: '17%'
        },
        {
            title: 'Actions ',
            dataIndex: 'status',
            key: 'action',
            render: status => {
                if (status == "Draft") {
                    return (<div className='justify-end'>
                        {/* <Button>Sign now</Button> */}
                        <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                            <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                        </Dropdown>
                    </div>)
                }
                else if (status == "Cancelled") {
                    return (<div className='justify-end pr-10'>
                        <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                            <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                        </Dropdown>
                    </div>)
                }
                else if (status == "In Progress") {
                    return (<div className='justify-end pr-10'>
                        <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                            <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                        </Dropdown>
                    </div>)
                }
                else if (status == "I need to sign") {
                    return (<div className='justify-end pr-10'>
                        <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                            <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                        </Dropdown>
                    </div>)
                }
                else if (status == "Completed") {
                    return (
                        <div className='justify-end pr-10'>
                            <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                            </Dropdown>
                        </div>
                    )
                }
            },
            width: '15%'
        },
    ];

    // const dataSource = [
    //     {
    //         key: '1',
    //         document: {
    //             mainTitle: 'Octet Design NDA',
    //             subTitle: 'To: ux test'
    //         },
    //         status: 'Cancelled',
    //         changes: '3 March, 2022',
    //         action: ''
    //     },
    //     {
    //         key: '2',
    //         document: {
    //             mainTitle: 'Octet Design NDA',
    //             subTitle: 'To: ux test'
    //         },
    //         status: 'Cancelled',
    //         changes: '3 March, 2022',
    //         action: ''
    //     },

    //     {
    //         key: '3',
    //         document: {
    //             mainTitle: 'Octet Design NDA',
    //             subTitle: 'To: ux test'
    //         },
    //         status: 'Completed',
    //         changes: '3 March, 2022',
    //         action: ''
    //     },
    // ];

    const items: MenuProps['items'] = [
        {
            label: 'Recover',
            key: '0',
        },
        {
            label: 'Delete permanently',
            key: '1',
        },

    ];

    const templates = [
        { key: 1 },
        { key: 2 },
        { key: 3 },
        { key: 4 },
        { key: 5 }

    ];


    return (
        <Layout>
            <div className='bg-h'>
                <header className='header'>
                    <h1>Bin</h1>
                </header>
                <main className='main-pad'>

                    <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={setActiveKey} className='bin-tabs'>
                        <TabPane
                            className='business-info-tabsouter'
                            tab={<p>Document</p>}
                            key="1">
                            <Table dataSource={filteredDataSource} columns={columns} pagination={false} className="table-1" />
                        </TabPane>
                        <TabPane
                            tab={<p>Templates</p>}
                            key="2"
                            className='py-24 div-row gap-24'
                        >
                            {activeKey == '2' && templates.map((template) => {
                                return (
                                    <div key={template.key} className='div-col gap-12 bin-template-container'>
                                        <div className='bin-template-header div-row justify-center'>
                                            <Image src={TEMPLATE_BIN.src} alt="template" preview={false} className='w-full m-auto' />
                                        </div>
                                        <div className='space-between bin-template-detail'>
                                            <div>
                                                <p className='mb-4 text-gray text-12 font-600'>Octet Design NDA</p>
                                                <p className='font-500 text-gray400 text-10'>3 March, 2022</p>
                                            </div>
                                            <Dropdown menu={{ items: items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                                                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                                            </Dropdown>
                                        </div>
                                    </div>
                                )
                            })
                            }

                        </TabPane>
                        <TabPane
                            tab={<p>My drive</p>}
                            key="3">
                            <div className='py-24'>
                                <div className='upload-my-drive space-between'>
                                    <div className='div-row gap-8 align-center'>
                                        <Image src={FOLDER.src} alt="folder" preview={false} />
                                        <p className='text-14 font-600 text-gray'>Octet Design </p>
                                    </div>
                                    <Dropdown menu={{ items: items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                                        <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                                    </Dropdown>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </main>
            </div>
        </Layout>
    )
}