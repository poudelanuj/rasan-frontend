import React from 'react'
import TabAll from './TabAll';
import TabSKU from './TabSKU';
import TabDrafts from './TabDrafts';
import { useQuery } from "react-query";
import { getCategory } from '../context/CategoryContext';


import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
const { TabPane } = Tabs;

const onChange = (key) => {
    console.log(key);
};

function Category() {
    const { slug } = useParams();
    const { data, isLoading, isError, error } = useQuery("get-category", () => getCategory({slug}));
    if (data) {
        console.log(data);
    }
    return (
        <>
            {isLoading && <div>Loading....</div>}
            {isError && <div>Error: {error.message}</div>}
            {data && (
            <div>
                <div className="text-3xl bg-white p-5">{data.data.data.name}</div>
                <Tabs defaultActiveKey="1" onChange={onChange}>
                    <TabPane tab="All" key="1">
                        <TabAll slug={slug} />
                    </TabPane>
                    <TabPane tab="SKU" key="2">
                        <TabSKU slug={slug} />
                    </TabPane>
                    <TabPane tab="Product Drafts" key="3">
                        <TabDrafts slug={slug} />
                    </TabPane>
                </Tabs>
            </div>
            )}
        </>
    )
}

export default Category