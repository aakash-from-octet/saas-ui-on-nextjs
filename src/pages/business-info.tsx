import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import { Col, Row, Image, Button, Form, Input, Tabs, Breadcrumb, message, notification } from "antd";
import { useRouter } from "next/router";
import {
  A_BUSINESS,
  A_INDIVIDUAL,
  A_SEPERATOR,
  LOGO,
} from "@/Components/utils/image-constants";
import { DEV_BASE_URL } from "@/config";
import Link from "next/link";
import useVanityUrl from "@/hooks/vanityURL";

interface FormValues {
  companyName?: string;
  website?: string;
  gstnumber?: string;
  url?: string;
}

export default function Otp() {
  const [selectedTab, setSelectedTab] = useState("1");
  const [form] = Form.useForm<FormValues>();
  const router = useRouter();

  const vanity = useVanityUrl();

  const handleTabChange = (key) => {
      setSelectedTab(key);
      form.resetFields()
     
  };

  const onFinish = async (values: FormValues) => {
    console.log(values, "form values");
    try {
      const token: string = sessionStorage.getItem("accessToken") || "";
      const commonData = {
        ...values,
      };

      let tabSpecificData = {};
      let type = "";

      if (selectedTab === "1") {
        tabSpecificData = {
          companyName: values.companyName,
          website: values.website,
          taxId: values.gstnumber,
          vanityUrl: values.url,
        };
        type = "Business";
      } else if (selectedTab === "2") {
        tabSpecificData = {
          vanityUrl: values.url,
        };
        type = "Individual";
      }

      const response = await axios.post(
        `${DEV_BASE_URL}/organization/create`,
        {
          ...tabSpecificData,
          type,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
     if(response.data.success==true)
      
     {

      if (typeof window !== "undefined") {
        localStorage.setItem('vanity', response.data.organization.vanityUrl);
      }

    
      notification.success({
        message: 'Success!',
        description: `${response.data.message}`,
        duration: 1,
        placement: "bottomRight"

      });
      
      // router.push(`/${response.data.organization.vanityUrl}/all-documents`);
      if (response.data.organization.vanityUrl) {
        router.push(`/${response.data.organization.vanityUrl}/all-documents`);
      } 
    
    }

     else{
      notification.error({
        message: 'Error!',
        description: `${response.data.message}`,
        duration: 1,
        placement: "bottomRight"

      });
    
     }
    } catch (error) {
      notification.error({
        message: 'Error!',
        description: `Error Occured`,
        duration: 1,
        placement: "bottomRight"

      });
    }
  };
  const getFormRules = (fieldName: string) => {
    switch (fieldName) {
      case "companyName":
        return selectedTab === "1"
          ? [
              {
                required: true,
                message: "Please input your company name!",
              },
              {
                max: 50,
                message: "Company name cannot be longer than 50 characters",
              },
            ]
          : [];
      case "website":
        return selectedTab === "1"
          ? [
              {
                required: true,
                message: "Please input your website!",
              },
              {
                pattern: new RegExp(/^(?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/),
                message: "Enter a valid website URL!",
              },
            ]
          : [];
      case "gstnumber":
        return selectedTab === "1"
          ? [
              {
                required: true,
                message: "Please input your TAX ID/GST number!",
              },
              {
                pattern: new RegExp(/^[0-9a-zA-Z]+$/),
                message: "Enter a valid TAX ID/GST number!",
              },
            ]
          : [];
      case "url":
        return [
          {
            required: true,
            message: "Please input your vanity URL!",
          },
          {
            pattern: new RegExp(/^[a-zA-Z0-9\-]+$/),
            message: "Vanity URL can only contain letters, numbers, and dashes.",
          },
        ];
      default:
        return [];
    }
  };

  const { TabPane } = Tabs;
console.log(selectedTab)
  return (
    <>
      <Head>
        <title>Business Info</title>
        <meta name="description" content="OTP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative bg-white">
        <div className="auth-logo-new">
          <Link href={'/'}>
            <Image
              src={LOGO.src}
              alt="Logo"
              height={26}
              width={118}
              preview={false}
            />
          </Link>
        </div>

        <Row align="middle">
          <Col flex='auto'>
            <div className="auth-wrap div-col gap-24">
              <Breadcrumb
                items={[
                  {
                    title: (
                      <p className="text-12 font-600 text-link align-center">
                        <span className="b-numbering">1</span>Signup
                      </p>
                    ),
                    href: "/signup",
                  },
                  {
                    title: (
                      <p className="text-12 font-600 text-link align-center">
                        <span className="b-numbering">2</span>Basic Information
                      </p>
                    ),
                    href: "/basic-info",
                  },
                  {
                    title: (
                      <p className="text-12 font-500 text-link align-center">
                        <span className="b-numbering">3</span>Business
                      </p>
                    ),
                  },
                ]}
                separator={
                  <Image
                    src={A_SEPERATOR.src}
                    preview={false}
                    alt="seperator"
                  />
                }
              />

              <h1 className="auth-header m-0">Set Up your Business</h1>

              <Tabs
                defaultActiveKey="1"
                className="auth-tab"
                onChange={handleTabChange}
              >
                <TabPane
                
                  // className="business-info-tabsouter"
                  className={`tab-content ${selectedTab === '1' ? 'tab-content-enter-active' : 'tab-content-exit-active'}`}
                  tab={
                    <div className="div-row gap-6">
                      <Image
                        src={A_BUSINESS.src}
                        alt="Logo"
                        height={16}
                        width={16}
                        preview={false}
                        className="img-centered"
                      />{" "}
                      <p className="text-12 text-gray400">For Business</p>
                    </div>
                  }
                  key="1"
                >
                  <Form
                    form={form}
                    name="otpForm"
                    requiredMark="optional"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    className="div-col gap-24"
                  >
                    <Form.Item
                      label={<span>Company name <span style={{ color: 'red' }}>*</span></span>}
                      name="companyName"
                      rules={getFormRules("companyName")}
                    >
                      <Input size="large" placeholder="John Doe PVT. LTD" className="modal-input" />
                    </Form.Item>

                    <Form.Item
                      label={<span>Website <span style={{ color: 'red' }}>*</span></span>}
                      name="website"
                      rules={getFormRules("website")}
                    >
                      <Input size="large" placeholder="www.elasticsign.com" className="modal-input" />
                    </Form.Item>

                    <Form.Item
                       label="TAX ID/ GST number" 
                      name="gstnumber"
                    
                    >
                      <Input size="large" placeholder="e.g. 22AAAA0000A1Z5" className="modal-input" />
                    </Form.Item>
                    <Form.Item label={<span>Vanity URL <span style={{ color: 'red' }}>*</span></span>} name="url" 
                    rules={[
                      {
                        required: true,
                        message: 'Please input your vanity URL!',
                      },
                      {
                        pattern: new RegExp(/^[a-zA-Z0-9\-]+$/),
                        message: 'Vanity URL can only contain letters, numbers, and dashes.',
                      },
                    ]}>
                      <Input
                        addonBefore="elasticsign.com/"
                        size="large"
                        placeholder="company"
                        className="modal-input-before"

                      />
                    </Form.Item>



                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                      >
                        Let’s get started
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
          
                <TabPane
                  tab={
                    <div className="div-row gap-6">
                      <Image
                        src={A_INDIVIDUAL.src}
                        alt="Logo"
                        height={16}
                        width={16}
                        preview={false}
                        className="img-centered"
                      />
                      <p className="text-12 text-gray400">For Individual</p>
                    </div>
                  }
                  className={`tab-content ${selectedTab === '2' ? 'tab-content-enter-active' : 'tab-content-exit-active'}`}
                  key="2"
                >
                                    {selectedTab === "2" && (

                  <Form
                    form={form}
                    name="otpForm"
                    layout="vertical"
                    requiredMark="optional"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    className="div-col gap-24"
                  >
                    <Form.Item label={<span>Vanity URL <span style={{ color: 'red' }}>*</span></span>} name="url" 
                    rules={[
                      {
                        required: true,
                        message: 'Please input your vanity URL!',
                      },
                      {
                        pattern: new RegExp(/^[a-zA-Z0-9\-]+$/),
                        message: 'Vanity URL can only contain letters, numbers, and dashes.',
                      },
                    ]}>
                      <Input
                        addonBefore="elasticsign.com/"
                        size="large"
                        placeholder="username"
                        className="modal-input-before"
                      />
                    </Form.Item>


                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                      >
                        Let’s get started
                      </Button>
                    </Form.Item>
                  </Form>
                   )}
                </TabPane>
              </Tabs>
            </div>
          </Col>
          <Col flex='486px' className="signupbg mt-auth-banner">
            {/* <h2 className="auth-banner-text">
              Transforming
              <br />
              traditional ways
              <br /> into Digital
            </h2> */}
          </Col>
        </Row>
      </main>
    </>
  );
}
