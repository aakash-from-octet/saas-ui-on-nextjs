import React, { useState } from 'react';
import { Button, Modal, Image, Row, Input, Form, Col } from 'antd';
import { ADD_SIGNEE, DRAG_V, MODAL_CLOSE, TRASH_DARK } from '@/Components/utils/image-constants';


const InviteSigneeModal = ({ setInviteSigneeModal }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(true);

    // for adding signees 
    const [signees, setSignees] = useState([{ name: '', email: '' }]);
    const handleAddSignee = () => {
        setSignees([...signees, { name: '', email: '' }]);
    };

    const handleNameChange = (index, value) => {
        // Update the name of the specific signee
        const newSignees = [...signees];
        newSignees[index].name = value;
        setSignees(newSignees);
    };
    const handleEmailChange = (index, value) => {
        // Update the email of the specific signee
        const newSignees = [...signees];
        newSignees[index].email = value;
        setSignees(newSignees);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setInviteSigneeModal(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setInviteSigneeModal(false);
    };

    const handleFormFinish = () => {
        console.log('form finish');
    }

    const handleDeleteSignee = (index: number) => {
        if (signees.length > 1) {
            const filteredSignees = signees.filter((_, i) => i !== index);
            setSignees(filteredSignees);
        }
    };
    const ModalHeader = () => {
        return (
            <div className='div-col gap-6 mb-20'>
                <p className='text-p'>Manage Signee</p>
                <p className='text-14 font-400 text-gray400 lh-24'>Please fill the below details to add another signee</p>
            </div>
        );
    };
    return (
        <Modal title={<ModalHeader />} maskClosable={true} className="m-double-header add-recipient-modal" open={isModalOpen} footer={null} closeIcon={<Image src={MODAL_CLOSE.src} preview={false} alt="modal-close" onClick={handleCancel} />}>
            <div className='modal-content-details'>
                <div className='div-col gap-30'>
                    <Form
                        name="add_recipient_form"
                        className="add-recipient-form"
                        initialValues={{ remember: true }}
                        onFinish={handleFormFinish}
                        onFinishFailed={(errorInfo) => {
                            console.log("Validation failed:", errorInfo);
                        }}
                    >
                        <div className="div-col gap-24">

                            <div className='div-col gap-12'>
                                <p className='form-label'>Add Signee</p>
                                {signees.map((signee, index) => (
                                    <Row gutter={[12, 12]} key={index}>
                                        <Col sm={11}>

                                            <div className='div-row gap-16 align-center'>
                                                <div className='align-center gap-8'>
                                                    <Image src={DRAG_V.src} height={24} width={24} alt="drag" preview={false} className='img-centered' />
                                                    <p className='signee-number-circle'>{index + 1}</p>
                                                </div>
                                                <Form.Item
                                                    name={`name-${index}`}
                                                    rules={[{ required: true, message: "Please enter your name." }]}
                                                >
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter name"
                                                        className='modal-input'
                                                        value={signee.name}
                                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col sm={13}>
                                            <div className='div-row gap-16 align-center'>
                                                <Form.Item
                                                    name={`email-${index}`}
                                                    className='w-full'
                                                    rules={[{ required: true, message: "Please enter your email." }]}
                                                >
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter email address"
                                                        className='modal-input'
                                                        value={signee.email}
                                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                                    />
                                                </Form.Item>
                                                <Image src={TRASH_DARK.src} alt="delete" height={28} preview={false} className='cursor-pointer' onClick={() => handleDeleteSignee(index)} />
                                            </div>

                                        </Col>

                                    </Row>
                                ))}  
                                <Button
                                    style={{ width: '100px' }}
                                    type='text'
                                    className='p-0 btn-with-lefticon'
                                    icon={<Image src={ADD_SIGNEE.src} preview={false} alt="add" />}
                                    onClick={handleAddSignee}
                                >
                                    Add Signee
                                </Button>
                            </div>
                        </div>
                    </Form>

                </div>
            </div>
            <div className='modal-content-footer'>
                <Button type='primary' size='large' block onClick={handleOk}>
                    Continue
                </Button>
            </div>

        </Modal>
    )
}

export default InviteSigneeModal;
