import Head from 'next/head';
import { useState } from "react";
import Link from 'next/link';
import { Col, Row, Image, Button, Form, Input, Checkbox, Breadcrumb, message, notification } from 'antd';
import { useRouter } from 'next/router';
import { A_SEPERATOR, I_SEPERATOR, LOGO } from '@/Components/utils/image-constants';
import axios from 'axios';
import { useFormState } from 'react-dom';
import { DEV_BASE_URL } from '@/config';
import PhoneNumberInput from '@/Components/Common/PhoneNumberInput';
export default function Otp() {
    const router = useRouter();
    const { userId } = router.query;
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        try {
            const formData = new FormData()
            setLoading(true);
            const token = sessionStorage.getItem("accessToken") || "";

            // Construct userData object
            let userData: any = {
                fullName: values.fullName,
                phoneNumber: values.phone,
                interests: values.interests,
                position: values.position
            };

            const finalUserId = Array.isArray(userId) ? userId[0] : userId;
            userData.id = finalUserId;
            // const payload = { userData: userData };
            // formData.append("userData", JSON.stringify(userData))

            const response = await axios.put(`${DEV_BASE_URL}/user/add-details`, JSON.stringify(userData), {
                headers: {
                    Authorization: ` ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success === true) {
                router.push("/business-info");
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
        } finally {
            setLoading(false);
        }
    };

    const plainOptions = ['Proposals', 'Quotes', 'Contracts', 'Forms', 'Notary', 'NDA'];
    return (
        <>
            <Head>
                <title>Basic Info</title>
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
                                        title: (<p className='text-12 font-600 text-link align-center'><span className='b-numbering'>1</span>Signup</p>),
                                        href: '/signup',
                                    },
                                    {
                                        title: (<p className='text-12 font-600 text-link align-center'><span className='b-numbering'>2</span>Basic Information</p>),
                                    },
                                    {
                                        title: (<p className='text-12 font-500 text-gray400 align-center'><span className='b-numbering b-inactive-numbering'>3</span>Business</p>),
                                    },
                                ]}
                                separator={<Image src={A_SEPERATOR.src} preview={false} alt='seperator' />}
                            />
                            <h1 className="auth-header m-0">
                                Tell us about you
                            </h1>
                            <Form
                                name="basic"
                                layout="vertical"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                                className='div-col gap-24'
                            >
                                <Form.Item
                                    label="Full Name"
                                    name="fullName"
                                >
                                    <Input size="large" placeholder="Full Name" className='modal-input' />
                                </Form.Item>
                                <Form.Item
                                    label="Position/ Title"
                                    name="position"
                                >
                                    <Input size="large" placeholder="e.g. Sales manager, HR manager" className='modal-input' />
                                </Form.Item>
                                <Form.Item
                                    label="Phone number"
                                    name="phoneNumber"
                                >
  <PhoneNumberInput value={phone} onChange={setPhone} />
                                    {/* <Input size="large" placeholder="987 895 8542" className='modal-input' /> */}
                                </Form.Item>

                                <Form.Item
                                    label="Interests"
                                    name="interests"
                                >
                                    <Checkbox.Group options={plainOptions} defaultValue={['Apple']} className="custom-ck" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" block>
                                        Continue
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col flex='486px' className="signupbg mt-auth-banner">
                        {/* <h2 className='auth-banner-text'>Transforming<br />traditional ways<br /> into Digital</h2> */}
                    </Col>
                </Row>
            </main>
        </>
    )
}
