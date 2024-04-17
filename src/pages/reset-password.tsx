import Head from 'next/head'
import Link from 'next/link'
import { Col, Row, Image, Button, Form, Input, Space, notification } from 'antd';
import { useRouter } from 'next/router';
import { ARROW_BACK, LOGO } from '@/Components/utils/image-constants';
import { useState } from 'react';
import PasswordResetSuccessful from '@/Components/Modal/PasswordResetSuccessful';
import axios from 'axios';
import { DEV_BASE_URL } from '@/config';


export default function ResetPassword() {

    const [newPassword, setNewPassword] = useState("");
    const [newCpassword, setNewCpassword] = useState("");

    const [successModal, setSuccessModal] = useState(false);

    const [form] = Form.useForm();
    const router = useRouter();
    const onReset = (e) => {
        e.preventDefault()
        router.push("/");
    };
    const onFinish = async (values:any) => {
        try {
          const response = await axios.put(`${DEV_BASE_URL}/user/reset-password`, {
            urlData: router.query.data,
            password: values.password,
          });
    
          if (response.data.success == true) {
            notification.success({
              message: 'Success!',
              description: `${response.data.message}`,
              duration: 1,
              placement: "bottomRight",
              className: 'toast-primary',
            });
            setSuccessModal(true);
            form.resetFields();
            router.push('/login');
          } else {
            
            notification.error({
                message: 'Error!',
                description: `${response.data.message}`,
                duration: 1,
                placement: "bottomRight",
                className: 'toast-primary',
      
              });
          }
        } catch (error) {
            notification.error({
                message: 'Error!',
                description: `Something Went Wrong`,
                duration: 1,
                placement: "bottomRight",
                className: 'toast-primary',
      
              });
        }
      };
    

    const onFinishFailed = (error) => {
        console.log('error is', error);
    };


    return (
        <>
            <Head>
                <title>Reset Password</title>
                <meta name="description" content="Login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-h">
                <div className='p-primary'>
                    <Image src={LOGO.src} alt="Logo" height={26} width={118} preview={false} />
                </div>

                <Row align="middle" justify="center" className='h-full' style={{ marginTop: '-66px' }}>
                    <Col span={24}>
                        <div className="auth-wrap">
                            <Space size={12} className='mb-40' align="center">
                                <Image src={ARROW_BACK.src} alt="back" className='cursor-pointer' height={24} width={24} preview={false} onClick={() => router.push('/login')} />
                                <h1 className="auth-header mb-0">
                                    Reset Password
                                </h1>

                            </Space>
                            {/* <Form
                                name="basic"

                                layout="vertical"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                                className='forgot-password-container div-col gap-24'
                            >
                                <Form.Item
                                    label="Email"
                                    name="Email"
                                    rules={[{ required: true, message: 'Please input your email!' }]}
                                >
                                    <Input size="large" placeholder="Email address" className='modal-input' />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block size="large" onClick={onReset}>
                                        Reset password
                                    </Button>
                                </Form.Item>
                            </Form> */}

                            <Form
                                name="reset-password"
                                className="div-col gap-24"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <div className='div-col gap-8'>
                                    <p className='text-14 font-600 text-gray'>New Password</p>
                                    <Form.Item

                                        name="password"
                                        rules={[{ required: true, message: 'Please enter your password.' },
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
                                            type='password'
                                            placeholder="Enter New Password"
                                            value={newPassword}
                                            className='modal-input h-40'
                                            onChange={(e) => {
                                                setNewPassword(e.target.value)
                                                // setErrorMessage(" ")
                                            }
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <div className='div-col gap-8'>
                                    <p className='text-14 font-600 text-gray'>Confirm New Password</p>
                                    <Form.Item

                                        name="c_password"
                                        rules={[{ required: true, message: 'Re-enter your password.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match.'));
                                            },
                                        }),]}
                                    >
                                        <Input.Password
                                            type='password'
                                            placeholder="Confirm New Password"
                                            value={newCpassword}
                                            onChange={(e) => {
                                                setNewCpassword(e.target.value)
                                                // setErrorMessage(" ")
                                            }
                                            }
                                            className='modal-input h-40'
                                        />
                                    </Form.Item>
                                </div>


                                <Form.Item>
                                    <Button type="primary" block htmlType="submit" size="large">
                                        Create New Password
                                    </Button>
                                </Form.Item>
                            </Form>


                        </div>
                    </Col>
                    {successModal &&
                        (<PasswordResetSuccessful
                            successModal={successModal}
                            setSuccessModal={setSuccessModal}
                        />)}
                </Row>

            </main >
        </>
    )
}
