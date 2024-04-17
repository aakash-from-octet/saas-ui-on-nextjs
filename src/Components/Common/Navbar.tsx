import React from 'react'
import { LOGO } from '../utils/image-constants'
import { Row, Image, Col, Button } from 'antd'
import Link from 'next/link'

const Navbar = () => {
    return (
        <div className='navbar-outer'>
            <div className='space-between gap-10'>
                <Link href={'/'}>
                    <Image src={LOGO.src} alt="logo" preview={false} />
                </Link>
                <Row justify="center" gutter={[40, 40]} className='nav-links'>
                    <Col><a href="#section4" className='text-dark text-15 font-500'>How it works</a> </Col>
                    <Col><a href="#section5" className='text-dark text-15 font-500'>Features</a> </Col>
                    <Col><a href="#section6" className='text-dark text-15 font-500'>Use Cases</a> </Col>
                    <Col><a href="#section7" className='text-dark text-15 font-500'>Pricing</a> </Col>
                    <Col><a href="#section10" className='text-dark text-15 font-500'>FAQs</a> </Col>
                </Row>
                <Row gutter={[16, 16]} wrap={false}>
                    <Col>
                        <Link href={'/login'}>
                            <Button type='default'>Log In</Button>
                        </Link>
                    </Col>
                    <Col>
                        <Link href={'/signup'}><Button type='primary'>Sign Up</Button></Link>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default Navbar