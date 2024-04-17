import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Row, Image, Button, Form, Input, message, notification } from "antd";
import { useRouter } from "next/router";
import { CLOSE_EYE, LOGO, OPEN_EYE } from "@/Components/utils/image-constants";
import { DEV_BASE_URL } from "@/config";
import axios from "axios";
import useVanityUrl from "@/hooks/vanityURL";
import { Spinner } from "@react-pdf-viewer/core";
// const [token, setToken] = useState("");
export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const vanity = useVanityUrl(); 
  console.log(vanity,"from login")
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      router.replace(`/${vanity}/settings/profile`);
    } else {
      setIsAuthenticated(false);
    }
  }, [router]);
  const onFinish = async (values: any) => {
    setLoading(true);
    console.log(values, "final value");
    try {
      const response = await fetch(`${DEV_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data: any = await response.json();
        if (data.success) {
          
          console.log("Login successful:", data);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("signerEmail",values?.email)
            window.sessionStorage.setItem("accessToken", data.token);
            localStorage.setItem('vanity',data?.payload?.orgVanityUrl);
          }
          notification.success({
            message: 'Success!',
            description: `Successfully Logged In`,
            duration: 2,
            placement: "bottomRight",
            className: 'toast-primary',
          });
        
          if (data?.payload?.orgVanityUrl) {
            router.push(`/${data?.payload?.orgVanityUrl}/all-documents`);
          } 
        } else {
          notification.error({
            message: 'Error!',
            description: `${data.message}`,
            duration: 1,
            placement: "bottomRight"
          });
        }
      }
      else {
        const data: any = await response.json();
        if (
          (data && data.success === false) ||
          data.status === 400 ||
          data.message === "User not found"
        ) {
          notification.error({
            message: 'Error!',
            description: `${data.message}. Please `,
            duration: 1,
            placement: "bottomRight",
            className: 'toast-primary',

          });
        } else {
          notification.error({
            message: 'Error!',
            description: `An error occured while logging in.`,
            duration: 2,
            placement: "bottomRight",
            className: 'toast-primary',

          });
        }
      }
    } catch (error) {
      notification.error({
        message: 'Error!',
        description: `An error occured while logging in.`,
        duration: 2,
        placement: "bottomRight",
        className: 'toast-primary',
      });
    } finally {
      setLoading(false);
    }
  };
  if (isAuthenticated === null) {
    return <div><Spinner /></div>;
  } else if (isAuthenticated) {
    return null; 
  }

  return (
    <>
      <Head>
        <title>Login</title>
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

        <Row align="middle" wrap={false} justify="center" >
          <Col flex='auto'>
            <div className="auth-wrap">
              <h1 className="auth-header">Login</h1>
              <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                className="login-form-container mb-24"
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
                  <Button type="primary" htmlType="submit" block size="large">
                    Login
                  </Button>
                </Form.Item>
              </Form>
              {/* <p className='text-center font-600'><Link href="/forgot-password" >
                                <a>Forgot password?</a>
                            </Link></p> */}
              <Link href="/forgot-password">
                <p className="text-14 text-center font-600 mb-24">
                  Forgot password?
                </p>
              </Link>

              <p className="text-14 text-center text-gray font-400">
                Don’t have an account ?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="font-600 text-link cursor-pointer"
                >
                  Signup
                </span>
              </p>
            </div>
          </Col>
          <Col flex='486px' className="login-bg mt-auth-banner">
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
