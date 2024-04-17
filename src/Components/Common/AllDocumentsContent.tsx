  import { Table, Dropdown, Image, Menu, Tooltip, Input, Button } from "antd";
  import { useRouter } from "next/router";
  import { ARROW_STEP, DOT, NODOC, SEARCHINPUT } from "@/Components/utils/image-constants";
  import { useEffect, useState } from "react";
  import { DEV_BASE_URL } from "@/config";
  import axios from "axios";
  import { useSelector } from "react-redux";
  import ContactsSkeleton from "./Skeletons/ContactsSkeleton";
  import TablesSkeleton from "./Skeletons/TablesSkeleton";
  import moment from "moment";
import useVanityUrl from "@/hooks/vanityURL";

  export default function AllDocumentsContent() {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const router = useRouter();
    const vanity = useVanityUrl(); 
    const getDocuments = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("accessToken") || "";
        const response = await axios.get(`${DEV_BASE_URL}/document/search`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.data.success === true) {
          const newDataSource = response.data.documents?.map((item) => ({
            key: item._id,
            document: item.fileName,
            status: item.documentStatus,
            changes: item.updatedAt,
            action: "",
          }));
          setDataSource(newDataSource);
          setFilteredDataSource(newDataSource);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    useEffect(() => {
      getDocuments();
    }, []);

    const handleAuditTrailClick = (documentId) => {
      router.push(`/${vanity}/audit-trail-page?documentId=${documentId}`);
    };
    const getStatusButtons = (status:any, documentId:any) => {
      switch (status) {
        case "Draft":
          return (
            <div  className="div-row gap-12 align-center">
              <Button className="gray-btn">Continue</Button>
              <Dropdown
                trigger={["click"]}
                className="btn-icon-round"
                placement="bottomRight"
                overlay={getStatusMenuItems(status, documentId)}
              >
                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
              </Dropdown>
            </div>
          );
        case "Inprogress":
          return (
            <div  className="div-row gap-12 align-center">
              <Button className="gray-btn">View Details</Button>
              <Dropdown
                trigger={["click"]}
                className="btn-icon-round"
                placement="bottomRight"
                overlay={getStatusMenuItems(status, documentId)}
              >
                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
              </Dropdown>
            </div>
          );
        case "Completed":
          return (
            <div  className="div-row gap-12 align-center">
              <Button className="gray-btn">View Details</Button>
              <Dropdown
                trigger={["click"]}
                className="btn-icon-round"
                placement="bottomRight"
                overlay={getStatusMenuItems(status, documentId)}
              >
                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
              </Dropdown>
            </div>
          );
        case "Cancelled":
          return (
            <div  className="div-row gap-12 align-center">
              <Button className="gray-btn">View Details</Button>
              <Dropdown
                trigger={["click"]}
                className="btn-icon-round"
                placement="bottomRight"
                overlay={getStatusMenuItems(status, documentId)}
              >
                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
              </Dropdown>
            </div>
          );
        case "Archived":
          return (
            <div  className="div-row gap-12 align-center">
              <Button className="gray-btn">View Details</Button>
              <Dropdown
                trigger={["click"]}
                className="btn-icon-round"
                placement="bottomRight"
                overlay={getStatusMenuItems(status, documentId)}
              >
                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
              </Dropdown>
            </div>
          );
        case "I need to sign":
          return (
            <div  className="div-row gap-12 align-center">
              <Button className="gray-btn">Sign</Button>
              <Dropdown
                trigger={["click"]}
                className="btn-icon-round"
                placement="bottomRight"
                overlay={getStatusMenuItems(status, documentId)}
              >
                <Image src={DOT.src} alt="Logo" height={24} width={24} preview={false} />
              </Dropdown>
            </div>
          );
        default:
          return null;
      }
    };
    const getStatusMenuItems = (status, documentId) => {
      switch (status) {
        case "Draft":
          return (
            
            <Menu>
              <Menu.Item key="0">Download PDF</Menu.Item>
              <Menu.Item key="1">Delete</Menu.Item>
            </Menu>
          );
        case "Inprogress":
          return (
            <Menu>
              <Menu.Item key="0">Download PDF</Menu.Item>
              <Menu.Item key="1" onClick={() => handleAuditTrailClick(documentId)}>Audit Trail</Menu.Item>
              <Menu.Item key="2">Create Copy</Menu.Item>
              <Menu.Item key="3">Edit & Resend</Menu.Item>
              <Menu.Item key="4">Cancel Document</Menu.Item>
            </Menu>
          );
        case "Completed":
          return (
            <Menu>
              <Menu.Item key="0">Move To</Menu.Item>
              <Menu.Item key="1" onClick={() => handleAuditTrailClick(documentId)}>Audit Trail</Menu.Item>
              <Menu.Item key="2">Create Copy</Menu.Item>
              <Menu.Item key="3">Rename</Menu.Item>
              <Menu.Item key="4">Delete</Menu.Item>
            </Menu>
          );
        case "Cancelled":
          return (
            <Menu>
              <Menu.Item key="0">Download PDF</Menu.Item>
              <Menu.Item key="1" onClick={() => handleAuditTrailClick(documentId)}>Audit Trail</Menu.Item>
              <Menu.Item key="2">Rename</Menu.Item>
              <Menu.Item key="3">Delete</Menu.Item>
            </Menu>
          );
        case "Archived":
          return (
            <Menu>
              <Menu.Item key="0">Delete Permanently</Menu.Item>
            </Menu>
          );
        case "I need to sign":
          return (
            <Menu>
              <Menu.Item key="0">Download PDF</Menu.Item>
              <Menu.Item key="1" onClick={() => handleAuditTrailClick(documentId)}>Audit Trail</Menu.Item>
              <Menu.Item key="2">Create Copy</Menu.Item>
              <Menu.Item key="3">Edit</Menu.Item>
              <Menu.Item key="4">Cancel</Menu.Item>
            </Menu>
          );
        default:
          return null;
      }
    };
    

    const columns = [
      {
        title: "Document",
        dataIndex: "document",
        key: "document",
        render: (document) => (
          <>
            <h3>{document}</h3>
            <p>{document}</p>
          </>
        ),
        width: "50%",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusMap = {
            Draft: "purple-tag",
            Cancelled: "orange-tag",
            Inprogress: "yellow-tag",
            "I need to sign": "blue-sign",
            Completed: "green-tag",
            Archived: "gray-tag",
          };
          return <p className={`doc-tag ${statusMap[status]}`}>{status}</p>;
        },
        width: "18%",
      },
      {
        title: "Last changes",
        dataIndex: "changes",
        key: "changes",
        render: (changes) => (
          <Tooltip title={moment(changes).format("MMMM Do, YYYY [at] h:mm A")} placement="bottom" overlayClassName="primary-tooltip" trigger="hover">
            <p className="text-gray font-500 w-fit">{moment(changes).format("MMMM Do, YYYY")}</p>
          </Tooltip>
        ),
        width: "17%",
      },
      {
        title: "Actions",
        dataIndex: "status",
        key: "action",
        render: (status, record) => getStatusButtons(status, record.key),
        width: "15%",
      },
    ];

    const EmptyPart = () => (
      <div className="div-col align-center no-document">
        <Image src={NODOC.src} preview={false} alt="no-doc" width={64} className="mb-12" />
        <p className="text-gray text-16 font-600 mb-6">No documents</p>
        <p className="text-12 font-500 text-gray400 text-center">Once a document is created, it will be listed here.</p>
      </div>
    );

    const handleSearchChange = (e) => {
      const value = e.target.value;
      setSearchValue(value);
    };

    useEffect(() => {
      if (searchValue.trim() === "") {
        setFilteredDataSource(dataSource);
      } else {
        const timeoutId = setTimeout(() => {
          executeSearch(searchValue);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }, [searchValue, dataSource]);

    const executeSearch = async (value) => {
      if (!value.trim()) {
        setFilteredDataSource(dataSource);
        return;
      }

      setLoading(true);
      try {
        const token = sessionStorage.getItem("accessToken") || "";
        const response = await axios.get(`${DEV_BASE_URL}/document/search?searchquery=${value}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.data.success) {
          const searchData = response.data.documents;
          const formattedSearchData = searchData.map((item) => ({
            key: item._id,
            document: item.fileName,
            status: item.documentStatus,
            changes: item.updatedAt,
            action: "",
          }));

          setFilteredDataSource(formattedSearchData);
        } else {
          setFilteredDataSource([]);
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
        setFilteredDataSource([]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-h">
        <header className="header">
          <h1 className="whitespace-nowrap">All Documents</h1>
          <Input
            placeholder="Search"
            className="header-search-bar"
            value={searchValue}
            onChange={handleSearchChange}
            prefix={<Image src={SEARCHINPUT.src} preview={false} alt="search" className="img-centered" />}
          />
          <div className="relative">
            <Button type="primary" onClick={() => router.push(`/${vanity}/create-document/upload-doc`)}>
              Create Document
            </Button>
            {filteredDataSource.length <= 0 && (
              <div className="arrow-createdoc">
                <Image src={ARROW_STEP.src} alt="create" preview={false} />
              </div>
            )}
          </div>
        </header>
        <main className="main-pad">
          {loading ? (
            <TablesSkeleton />
          ) : filteredDataSource && filteredDataSource.length > 0 ? (
            <Table dataSource={filteredDataSource} columns={columns} pagination={false} className="table-1" />
          ) : (
            <EmptyPart />
          )}
        </main>
      </div>
    );
  }
