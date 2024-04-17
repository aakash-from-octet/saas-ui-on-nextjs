import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Spin,
  Tabs,
  notification,
} from "antd";
import {
  ADD_SIGNEE,
  ARROW_BACK,
  ARROW_DOWN,
  BIN_DARK,
  BREADCRUMB_ARROW,
  ME_ONLY,
  ME_OTHERS,
  OTHERS_ONLY,
} from "@/Components/utils/image-constants";
import { useRouter } from "next/router";
import axios from "axios";
import { DEV_BASE_URL } from "@/config";
import useVanityUrl from "@/hooks/vanityURL";

let contactsfromApi: any;

// const contactsfromApi = [
//   { label: "John Doe", value: "johndoe@gmail.com" },
//   { label: "Jane Doe", value: "janedoe@gmail.com" },
// ];

const AddRecipientsPage = () => {
  const [tabFields, setTabFields] = useState({
    "1": [
      { name: "", email: "", recipientType: "Signer", isInitial: true },
      { name: "", email: "", recipientType: "Signer", isInitial: false },
    ],
    "2": [{ name: "", email: "", recipientType: "Signer" }],
    "3": [{ name: "", email: "", recipientType: "Signer", isInitial: true }],
  });
  const [activeTab, setActiveTab] = useState("1");
  const router = useRouter();
  const [saveContact, setSaveContact] = useState(false);
  const vanity = useVanityUrl(); 
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [initialData, setInitialData] = useState<any>([]);
  const [User, setUser] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const getContact = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("accessToken") || "";
      const response = await axios.get(`${DEV_BASE_URL}/contact`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success === true) {
        console.log(response.data.contacts);
        contactsfromApi = response?.data?.contacts?.map((contact: any) => ({
          label: contact?.name,
          value: contact?.email,
        }));
        setUser(response.data.contacts);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getContact();
  }, []);
  const addField = (tabKey: string) => {
    const updatedFields = [
      ...tabFields[tabKey],
      { name: "", email: "", recipientType: "Signer", isInitial: false },
    ];
    setTabFields((prev) => ({ ...prev, [tabKey]: updatedFields }));
  };

  const deleteField = (tabKey, index) => {
    const fieldsForTab = tabFields[tabKey];

    if (tabKey === "1") {
      if (fieldsForTab.length > 2) {
        const updatedFields = [...fieldsForTab];
        updatedFields.splice(index, 1);
        setTabFields({ ...tabFields, [tabKey]: updatedFields });
      }
    } else {
      if (fieldsForTab.length > 1) {
        const updatedFields = [...fieldsForTab];
        updatedFields.splice(index, 1);
        setTabFields({ ...tabFields, [tabKey]: updatedFields });
      }
    }
  };

  const onChangeField = (tabKey, index, type, value) => {
    const updatedTabFields = { ...tabFields };
    const updatedFields = [...updatedTabFields[tabKey]];
    updatedFields[index][type] = value;
    updatedTabFields[tabKey] = updatedFields;
    setTabFields(updatedTabFields);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setProfileLoaded(true);
      try {
        const token = sessionStorage.getItem("accessToken") || "";
        const response = await axios.get(`${DEV_BASE_URL}/user/profile`, {
          headers: {
            Authorization: ` ${token}`,
          },
        });
        console.log(response.data.user, "yo");
        setInitialData(response.data?.user?.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setProfileLoaded(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (initialData) {
      const updatedTabFields = { ...tabFields };
      updatedTabFields["1"][0] = {
        ...updatedTabFields["1"][0],
        name: initialData.fullName,
        email: initialData.email,
      };
      updatedTabFields["3"][0] = {
        ...updatedTabFields["3"][0],
        name: initialData.fullName,
        email: initialData.email,
      };
      setTabFields(updatedTabFields);
    }
  }, [initialData]);

  const submitSignersDetails = async () => {
    const documentID = sessionStorage.getItem("ProductdocumentId");
    const documentId = documentID;
    const tabMapping = {
      "1": "Me & Others",
      "2": "Others Only",
      "3": "Me Only",
    };
    const eSigne = tabMapping[activeTab];

    const eSigners = tabFields[activeTab].map((signer, index) => {
      const isDocumentOwner =
        signer.name === initialData.fullName &&
        signer.email === initialData.email;
      return {
        name: signer.name,
        email: signer.email,
        eSignRequired: signer.eSignRequired,
        recipient: signer.recipientType,
        isDocumentOwner: isDocumentOwner,
      };
    });
    try {
      const response = await axios.put(
        `${DEV_BASE_URL}/document/add-signers`,
        {
          documentId,
          eSigne,
          eSigners,
          saveContact: saveContact,
        },
        {
          headers: {
            Authorization: ` ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Signers Added Successfully.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Failed to add the signers.",
          placement: "bottomRight",
          className: "toast-primary",
          duration: 2,
        });
      }
    } catch (error) {
      console.error("Failed to add signers details:", error);
    }
  };
  const handleClick = () => {
    submitSignersDetails();
    router.push(`/${vanity}/create-document/prepare-doc`);
  };
  const tabsContent = ({ tabKey }: any) => {
    return (
      <>
        <div className="div-col gap-16 rightsec-add-recipient">
          {tabFields[tabKey].map((field, index) => (
            <Row gutter={[12, 12]} key={index}>
              <Col span={5}>
                <Select
                  defaultValue="Signer"
                  value={field.recipientType} // Ensure this uses the state's value
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    onChangeField(tabKey, index, "recipientType", value)
                  }
                  className="h-40 product-select-recipient"
                  suffixIcon={
                    <Image src={ARROW_DOWN.src} alt="select" preview={false} />
                  }
                  options={[
                    { value: "Signer", label: "Signer" },
                    { value: "CC", label: "CC" },
                  ]}
                  disabled={tabKey !== "2" && field.isInitial && index === 0}
                />
              </Col>
              <Col span={6}>
                <AutoComplete
                  style={{ width: "100%", height: "40px" }}
                  placeholder="Enter name"
                  value={field.name}
                  options={contactsfromApi}
                  filterOption={(inputValue, option) =>
                    (option?.label as string)
                      ?.toUpperCase()
                      ?.includes(inputValue?.toUpperCase())
                  }
                  onSelect={(value, option) => {
                    onChangeField(tabKey, index, "name", option.label);
                    onChangeField(tabKey, index, "email", value);
                  }}
                  onChange={(e) => onChangeField(tabKey, index, "name", e)}
                  className="h-40 product-input-autocomplete"
                  disabled={tabKey !== "2" && field.isInitial && index === 0}
                />
              </Col>
              <Col span={12}>
                <Input
                  type="text"
                  size="large"
                  value={field.email}
                  onChange={(e) =>
                    onChangeField(tabKey, index, "email", e.target.value)
                  }
                  placeholder="Email"
                  className="h-40 product-input-recipient"
                  disabled={tabKey !== "2" && field.isInitial && index === 0}
                />
              </Col>
              <Col span={1} className="div-row justify-center">
                {tabKey !== "3" && (
                  <Image
                    src={BIN_DARK.src}
                    alt="bin"
                    preview={false}
                    className="img-centered cursor-pointer"
                    onClick={() => deleteField(tabKey, index)}
                  />
                )}
              </Col>
            </Row>
          ))}

          <div
            className={`${tabKey === "3" ? "justify-end" : "space-between"}`}
          >
            {tabKey !== "3" && (
              <Button
                type="text"
                className="p-0 btn-with-lefticon text-16"
                onClick={() => addField(tabKey)}
              >
                <Image src={ADD_SIGNEE.src} preview={false} alt="add" /> Add
                field
              </Button>
            )}

            {tabKey !== "3" && (
              <Checkbox
                className="save-contact-checkbox"
                checked={saveContact}
                onChange={(e) => setSaveContact(e.target.checked)}
              >
                <span className="text-12 font-500 text-gray400 lh-20 mt-n2">
                  Save Contact
                </span>
              </Checkbox>
            )}
          </div>
        </div>
        <div className="w-full justify-end">
          <Button type="primary" className="w-fit" onClick={handleClick}>
            Prepare
          </Button>
        </div>
      </>
    );
  };

  const onChange = (key) => {
    setActiveTab(key);
  };

  if (loading) {
    return <Spin />;
  }
  const items = [
    {
      key: "1",
      label: (
        <div className="div-row gap-8 align-center">
          <Image
            src={ME_OTHERS.src}
            preview={false}
            alt="me-others"
            className="img-centered"
          />
          <p className="text-14 font-400 lh-20">Me & others</p>
        </div>
      ),
      children: tabsContent({ tabKey: "1" }),
    },
    {
      key: "2",
      label: (
        <div className="div-row gap-8 align-center">
          <Image
            src={OTHERS_ONLY.src}
            preview={false}
            alt="others-only"
            className="img-centered"
          />
          <p className="text-14 font-400 lh-20">Others only</p>
        </div>
      ),
      children: tabsContent({ tabKey: "2" }),
    },
    {
      key: "3",
      label: (
        <div className="div-row gap-8 align-center">
          <Image
            src={ME_ONLY.src}
            preview={false}
            alt="me-only"
            className="img-centered"
          />
          <p className="text-14 font-400 lh-20">Me only</p>
        </div>
      ),
      children: tabsContent({ tabKey: "3" }),
    },
  ];
  let fileName: any;
  if (typeof window !== "undefined") {
    fileName = sessionStorage.getItem("fileName") || "";
  }

  return (
    <div className="bg-white h-100vh">
      {/* header  */}
      <div className="p-header bg-white border-b space-between">
        <div className="div-row gap-12 align-center">
          <Image
            src={ARROW_BACK.src}
            alt="back"
            preview={false}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <p className="text-gray400 text-15 font-600">
            {fileName ? fileName : " Untitled"}
          </p>
        </div>

        <Breadcrumb
          className="create-doc-breadcrumb"
          separator={
            <Image
              src={BREADCRUMB_ARROW.src}
              alt="back"
              preview={false}
              className="cursor-pointer justify-center"
            />
          }
          items={[
            {
              title: (
                <p className="bread-label bread-active div-row align-center">
                  <span className="bread-num">1</span>Upload
                </p>
              ),
              href: `/create-document/upload-doc`,
            },
            {
              title: (
                <p className="bread-label bread-active">
                  <span className="bread-num">2</span>Add recipients
                </p>
              ),
              href: "#",
            },
            {
              title: (
                <p className="bread-label bread-inactive">
                  <span className="bread-num">3</span>Prepare
                </p>
              ),
              href: "/create-document/prepare-doc",
            },
          ]}
        />
        <div />
      </div>

      {/* main content */}
      <div className="justify-center">
        <div className="product-container upload-outer-container">
          <div className="div-col gap-30">
            {/* headings */}
            <div className="div-col gap-6">
              <p className="text-gray font-600 text-18">Add recipients</p>
              <p className="text-gray400  font-500 text-12">
                Some copy for give more infomation to the user
              </p>
            </div>

            {/* signers type details  */}
            <Tabs tabPosition={"left"} items={items} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientsPage;
