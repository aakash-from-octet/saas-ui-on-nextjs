import Layout from '@/Components/Common/Layout';
import AllDocumentsContent from '@/Components/Common/AllDocumentsContent';
import { useCallback, useEffect, useState } from 'react';
import { DEV_BASE_URL } from '@/config';
import axios from 'axios';



export default function AllDocuments({ }) {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [needToSignCount, setNeedToSignCount] = useState(0);
    async function fetchDocuments(setLoading, setDataSource, setFilteredDataSource, setNeedToSignCount) {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("accessToken") || "";
            let url = `${DEV_BASE_URL}/document/unsigned`;
    
            const response = await axios.get(url, {
                headers: {
                    Authorization: `${token}`,
                },
            });
    
            if (response.data.success) {
                const newDataSource = response.data.documents?.map((item) => ({
                    key: item._id,
                    document: item.fileName,
                    status: item.documentStatus,
                    changes: item.updatedAt,
                    action: "",
                }));
                setDataSource(newDataSource);
                setFilteredDataSource(newDataSource);
                const count = newDataSource.filter(doc => doc.status === 'Draft').length;
                setNeedToSignCount(count);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const loadDocuments = useCallback(() => {
       
        fetchDocuments(setLoading, setDataSource, setFilteredDataSource, setNeedToSignCount);
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);
console.log(needToSignCount)
    return (
        <Layout needToSignCount={needToSignCount}>
            <AllDocumentsContent  />
        </Layout>
    )
}