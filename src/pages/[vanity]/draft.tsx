import Link from 'next/link';
import { Table, Button, Dropdown, Menu, Image, Row, Col, Input, MenuProps, Tooltip } from 'antd';
import Layout from '@/Components/Common/Layout';
import { DOT, NODOC, SEARCHINPUT } from '@/Components/utils/image-constants';
import DeleteModal from '@/Components/Modal/DeleteModal';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';
import TablesSkeleton from '@/Components/Common/Skeletons/TablesSkeleton';
import moment from 'moment';
import useVanityUrl from '@/hooks/vanityURL';


export default function AllDocuments({ }) {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dataSource, setDataSource] = useState<any>([])
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const vanity = useVanityUrl(); 
  const selectedStatus = useSelector((state: any) => state?.selectedStatus);
  console.log(selectedStatus,"selectedStatus")
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
      let status = selectedStatus === "draft" && "Draft" ;
      let url = `${DEV_BASE_URL}/document/search?searchquery=${searchValue.trim()}${status ? `&status=${status}` : ''}`;
      
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
  }, [searchValue, selectedStatus]);

  useEffect(() => {
    const debouncedFetch = debounce(() => fetchDocuments(), 400);
    debouncedFetch();
  }, [fetchDocuments]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
console.log(filteredDataSource,"filteredDataSource")
  
  
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
      title: 'Actions',
      dataIndex: 'status',
      key: 'action',
      render: status => {
        return (<div className='div-row gap-12 align-center'>
          <Link href={`${vanity}/create-document/prepare-doc`}><Button className='gray-btn'>Continue</Button></Link>
          <Dropdown menu={{ items }} trigger={['click']} className="btn-icon-round" placement="bottomRight">
            <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
          </Dropdown>
        </div>)
      },
      width: '15%'
    },
  ];



  const items: MenuProps['items'] = [
    {
      label: 'Download PDF',
      key: '0',
    },
    {
      label: (<DeleteModal />),
      key: '3',
    },


  ];
    
  
    return (
        <Layout>
            <div className='bg-h'>
                <header className='header'>
                    <h1>Draft</h1>
                    <Input
            placeholder="Search"
            className="header-search-bar"
            value={searchValue}
            onChange={handleSearchChange} // Changed from onSearch to onChange
            allowClear
            prefix={<Image src={SEARCHINPUT.src} preview={false} alt="search" className="img-centered" />}
/>
                    <Button type='primary'>Create Document</Button>
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