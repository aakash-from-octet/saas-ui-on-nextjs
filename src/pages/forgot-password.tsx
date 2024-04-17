import Head from 'next/head'
import Link from 'next/link'
import { Col, Row, Image, Button, Form, Input, Space, notification } from 'antd';
import { useRouter } from 'next/router';
import { ARROW_BACK, LOGO } from '@/Components/utils/image-constants';
import axios from 'axios';
import { DEV_BASE_URL } from '@/config';

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values:any) => {
 
    try {
     
      const response = await axios.put(`${DEV_BASE_URL}/user/forgot-password`, {
        email: values.Email,
      });
console.log(response)
      if (response.data.success == true) {
        notification.success({
          message: 'Success!',
          description: `${response.data.message}`,
          duration: 1,
          placement: "bottomRight",
          className: 'toast-primary',

        });
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
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" bg-h">

        <Image src={LOGO.src} alt="Logo" height={26} width={118} preview={false} className="auth-logo" />


        <Row align="middle" justify="center" className='forgot-center'>
          <Col span={24}>
            <div className="auth-wrap">
              <Space size={12} className='mb-40' align="center">
                <Image src={ARROW_BACK.src} alt="back" className='cursor-pointer' height={24} width={24} preview={false} onClick={() => router.push('/login')} />
                <h1 className="auth-header mb-0">
                  Forgot password
                </h1>

              </Space>
              <Form
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
                  <Button type="primary" htmlType="submit" block size="large" >
                    Reset password
                  </Button>
                </Form.Item>
              </Form>


            </div>
          </Col>

        </Row>

      </main>
    </>
  )
}
