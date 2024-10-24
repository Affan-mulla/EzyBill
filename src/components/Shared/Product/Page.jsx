import { useEffect, useState } from "react";
import { columns } from "./Coloumn";
import { DataTable } from "./DataTable";
import { useUserContext } from "@/Context/AuthContext";
import { useGetProduct } from "@/lib/Query/queryMutation";
import Loader from "@/components/ui/Loader";

const DemoPage = () => {
  const [data, setData] = useState([]);
  const { user } = useUserContext();
  const { data: allProducts, isLoading, refetch } = useGetProduct(user.id);  // `refetch` to be passed down

  useEffect(() => {
    if (allProducts) {
      setData(allProducts);  // Assuming `allProducts` is an array of objects
    }
  }, [allProducts]);

  if (isLoading) {
    return <Loader />; // Handle loading state
  }

  return (
    <div className="container mx-auto">
      {/* Pass down refetch as fetchData */}
      <DataTable columns={columns} data={data} fetchData={refetch} filterName={'productName'} dateFilter={false} />
    </div>
  );
};

export default DemoPage;
