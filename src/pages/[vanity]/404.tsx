import { Button, Image } from 'antd'
import { NOT_FOUND_PAGE } from '@/Components/utils/image-constants';
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <div className='not-found-container'>
                <Image src={NOT_FOUND_PAGE.src} alt="404 error not found" preview={false} />
                <h1 className='text-p'>Page Not Found</h1>
                <p className='text-gray400 text-16 font-400 lh-26'>The page you’re looking for does not seem to exist.</p>
                <Link href={'/'}>
                    <Button size='large' type='primary'>Go To Home Page</Button>
                </Link>
            </div>
        </>
    );
}