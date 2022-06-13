import React from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { getProductGroups } from '../context/CategoryContext'
import AddCategory from './AddCategory'
import CategoryWidget from './CategoryWidget'
import AddCategoryButton from './subComponents/AddCategoryButton'
import Header from './subComponents/Header'
import SearchBox from './subComponents/SearchBox'

function ProductGroupsScreen() {
    const { data, isLoading, isError, error } = useQuery("get-product-groups", getProductGroups);
    const location = useLocation();
    //   var brandSlug;
    //   try {
    //     brandSlug = location.pathname.split("/")[2];
    //   } catch (error) {
    //     brandSlug = null;
    //   }
    const groups = data?.data?.data?.results;
    return (
        <>
            <div>
                <Header title="Product Groups" />
                {/* {isLoading && <div>Loading....</div>} */}
                <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
                    <div className="flex justify-between mb-3">
                        <SearchBox placeholder="Search Brands..." />
                        <div>
                            <AddCategoryButton linkTo='add' linkText='Add Product Groups' />
                        </div>
                    </div>
                    {isLoading && <div>Loading....</div>}
                    {isError && <div>Error: {error.message}</div>}
                    <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
                        {groups && groups.map((group, index) =>
                            <CategoryWidget image={group.product_group_image.medium_square_crop} title={group.name} slug={group.slug} id={group.sn} completeLink={`/brands/${group.slug}`} key={group.sn} imgClassName='' />
                        )}
                    </div>
                </div>
            </div>
            {/* {
      brandSlug && (
        <AddCategory />
      )
    } */}
        </>
    )
}

export default ProductGroupsScreen