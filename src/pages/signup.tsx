import Head from "next/head";
import Link from "next/link";
import { Col, Row, Image, Button, Form, Input, message, notification, Spin } from "antd";
import { useRouter } from "next/router";
import { CLOSE_EYE, LOGO, OPEN_EYE } from "@/Components/utils/image-constants";
import { useState } from "react";
import { DEV_BASE_URL } from "@/config";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

  const onFinish = async (values:any) => {
    console.log("before try block")
    try {
      
  console.log("function started")
      const response = await fetch(`${DEV_BASE_URL}/user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  console.log(response,"ress")
 
      if (data.success) {
        console.log("second message")
        sessionStorage.setItem("signerEmail",values?.email)
        sessionStorage.setItem("ProductdocumentId",data?.message)
        notification.success({
          message: 'Success!',
          description: "Otp has been sent to your email id for verification.",
          duration: 2,
          placement: "bottomRight",
          className: 'toast-primary',
        });
        router.push("/otp");
      } else {
        console.log("first message")
        notification.error({
          message: 'Error!',
          description: `${data.message}`,
          duration: 1,
          placement: "bottomRight"
        });
      }
    } catch (error) {
      console.log("error from catch block")
      notification.error({
        message: 'Error!',
        description: 'An error occured while Signing in.',
        duration: 2,
        placement: "bottomRight",
        className: 'toast-primary',
      });
    } 
  };
  

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white">
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
            <div className="auth-wrap">
              <h1 className="auth-header">Signup</h1>
              <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                                className="signup-form-container mb-24"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your email.' },
                  { type: 'email', message: 'Please enter a valid email address.' }
                  ]}
                >
                  <Input
                    placeholder="Email address"
                    className="modal-input h-40"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' },
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters long.'
                  },
                  () => ({
                    validator(_, value) {
                      if (value && value.length >= 8) {
                        const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/;
                        if (!pattern.test(value)) {
                          return Promise.reject(new Error('Password must contain at least one uppercase letter, one number, and one special character.'));
                        }
                      }
                      return Promise.resolve();
                    }
                  })
                  ]}
                >
                  <Input.Password
                    iconRender={(visible) => (
                      <Image
                        src={visible ? OPEN_EYE.src : CLOSE_EYE.src}
                        preview={false}
                        alt="open"
                      />
                    )}
                    placeholder="Password"
                    className="modal-input h-40"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    // onClick={onFinish}
                  
                  >
                    Signup
                  </Button>
                </Form.Item>
              </Form>
              <p className="text-14 text-gray font-400 mb-24">
                Already have an account ?{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="font-600 text-link cursor-pointer"
                >
                  Login
                </span>
              </p>

              <p className="text-12 font-500 text-gray400">
                Creating an account means you’re okay with our{" "}
                <span className="text-underline">Terms of Service</span>,<br />{" "}
                <span className="text-underline">Privacy Policy</span>, and our
                default Notification Settings.
              </p>
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
