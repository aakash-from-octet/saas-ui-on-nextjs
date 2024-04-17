import { Table, Button, Dropdown, Menu, Image, Row, Col, Input } from 'antd';
import { useRouter } from 'next/router'
import Layout from '@/Components/Common/Layout';
import { DOT, DOTSDOTS, SETUP_1, SETUP_2, SETUP_3, SETUP_4 } from '@/Components/utils/image-constants';
import AllDocumentsContent from '@/Components/Common/AllDocumentsContent';
import KycModal from '@/Components/Modal/KycModal';


export default function AccountSetup({ }) {
    const { Search } = Input;
    const onSearch = (value) => console.log(value);
    const router = useRouter();

    const navigateDocument = () => {
        router.push('/upload')
    }

    return (
        <Layout>
            <div className='acc-setup-outer'>
                <header className='space-between'>
                    <div className='div-col gap-6'>
                        <p className='text-12 font-500 text-blue'>Hello John</p>
                        <p className='text-14 font-600 text-gray'>Let’s setup your account</p>
                    </div>
                    <Button className='btn-transparent-bg'>Do it later</Button>
                </header>
                <Image src={DOTSDOTS.src} preview={false} alt="line" height={14} className='dotsdots-line' />
                <section>
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <div className='account-setup-steps space-between'>
                                <div className="align-center gap-12">
                                    <Image src={SETUP_1.src} preview={false} alt="step1" />
                                    <p>Setup signuature & Initial</p>
                                </div>
                                <Button className='gray-btn'>Setup</Button>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className='account-setup-steps space-between'>
                                <div className="align-center gap-12">
                                    <Image src={SETUP_2.src} preview={false} alt="step1" />
                                    <p>Verify your Identity</p>
                                </div>
                                <KycModal />
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className='account-setup-steps space-between'>
                                <div className="align-center gap-12">
                                    <Image src={SETUP_3.src} preview={false} alt="step1" />
                                    <p>Create Document</p>
                                </div>
                                <Button className='gray-btn'>Create</Button>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className='account-setup-steps space-between'>
                                <div className="align-center gap-12">
                                    <Image src={SETUP_4.src} preview={false} alt="step1" />
                                    <p>Create Templates</p>
                                </div>
                                <Button className='gray-btn'>Create</Button>
                            </div>
                        </Col>
                    </Row>
                </section>
            </div>
            <main className='bg-white'>
                <AllDocumentsContent />
            </main>
        </Layout>
    )
}