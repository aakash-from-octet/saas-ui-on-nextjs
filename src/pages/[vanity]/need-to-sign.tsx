import Link from 'next/link';
import { Table, Button, Dropdown, Menu, Image, Row, Col, Input, MenuProps, Tooltip } from 'antd';
import Layout from '@/Components/Common/Layout';
import { DOT, NODOC, SEARCHINPUT } from '@/Components/utils/image-constants';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { DEV_BASE_URL } from '@/config';
import { useSelector } from 'react-redux';
import axios from 'axios';
import TablesSkeleton from '@/Components/Common/Skeletons/TablesSkeleton';
import CancelDocModal from '@/Components/Modal/CancelDocModal';
import useVanityUrl from '@/hooks/vanityURL';


export default function AllDocuments({ }) {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [dataSource, setDataSource] = useState<any>([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [needToSignCount, setNeedToSignCount] = useState(0);
    const vanity = useVanityUrl(); 
    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        try {
          const token = sessionStorage.getItem("accessToken") || "";
        
          let url = `${DEV_BASE_URL}/document/unsigned`;
          
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
            const count = newDataSource.filter(doc => doc.status === 'Draft').length;
            setNeedToSignCount(count);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching documents:', error);
        } finally {
          setLoading(false);
        }
      }, []);
    
useEffect(()=>{

    fetchDocuments()
},[])

    const columns = [
        {
            title: 'Document',
            dataIndex: 'document',
            key: 'document',
            render: (document, record): any => {
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
            title: 'Actions',
            dataIndex: 'status',
            key: 'action',
            render: (record): any => {
                return (<div className='div-row gap-12 align-center'>
                    <Link href={`${vanity}/create-document/prepare-doc`}> <Button className='gray-btn'>Sign</Button> </Link>
                    <Dropdown menu={record.external ? { items: items2 } : { items: items1 }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
                        <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
                    </Dropdown>
                </div>)
            },
            width: '15%'
        },
    ];
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
   


    const items1: MenuProps['items'] = [
        {
            label: 'Download PDF',
            key: '0',
        },
        {
            label: 'Audit Trail',
            key: '1',
        },
        {
            label: (<CancelDocModal />),
            key: '3',
        },

    ];
    const items2: MenuProps['items'] = [
        {
            label: 'Download PDF',
            key: '0',
        },
        {
            label: 'Audit Trail',
            key: '1',
        },
        {
            label: 'Create copy',
            key: '2',
        },
        {
            label: 'Edit',
            key: '3',
        },
        {
            label: (<CancelDocModal />),
            key: '4',
        },

    ];

    let debounceTimeout: any;
    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchValue(value);
  
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
  
      debounceTimeout = setTimeout(() => {
        executeSearch(value);
      }, 1000);
    };
  
    
   
      const executeSearch = (value:any) => {
        setLoading(true);
        const filteredData = dataSource.filter(item => item.document.toLowerCase().includes(value.toLowerCase()));
        setFilteredDataSource(filteredData);
        setLoading(false);
    };
      
      useEffect(() => {
        console.log('Filtered Data Source Updated:', filteredDataSource);
      }, [filteredDataSource]);
      useEffect(() => {
        return () => {
   
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }
        };
      }, []);
 

    return (
        <Layout needToSignCount={needToSignCount}>
            <div className='bg-h'>
                <header className='header'>
                    <h1>I need to sign</h1>
                    {/* <Search placeholder="Search" className="header-search-bar" onSearch={onSearch} allowClear prefix={<Image src={SEARCHINPUT.src} preview={false} alt="search" className='img-centered' />} /> */}
                    <Input
          placeholder="Search"
          className="header-search-bar"
          value={searchValue}
          onChange={handleSearchChange} // Changed from onSearch to onChange
          allowClear
          prefix={<Image src={SEARCHINPUT.src} preview={false} alt="search" className="img-centered" />}
        />
                    <Button type='primary' size='large'>Create Document</Button>
                </header>
                <main className='main-pad'>
                {loading ? (
            <TablesSkeleton />
          ) : filteredDataSource && filteredDataSource.length > 0 ? (
            <Table
              dataSource={filteredDataSource}
              columns={columns}
              pagination={false}
              className="table-1"
            />
          ) : (
            <EmptyPart />
          )}
                </main>
            </div>
        </Layout>
    )
}