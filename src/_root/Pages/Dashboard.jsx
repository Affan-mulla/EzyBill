import { useState, useMemo } from 'react';
import { useUserContext } from '@/Context/AuthContext';
import { useGetProduct, useGetCustomers } from '@/lib/Query/queryMutation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/ui/Loader';
import { AreaChart1 } from '@/components/Dashboard/AreaChart';
import Recent from '@/components/Dashboard/Recent';
import {
  IconCash,
  IconShoppingCart,
  IconPackage,
  IconAlertTriangle,
  IconCreditCard,
  IconBrandProducthunt
} from '@tabler/icons-react';
import { DatePickerWithPresets } from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  const { user } = useUserContext();
  const [dateRange, setDateRange] = useState(null);

  // Fetch products and customers data
  const { data: products, isLoading: productsLoading } = useGetProduct(user?.id);
  const { data: customers, isLoading: customersLoading } = useGetCustomers(
    user?.id, 
    dateRange || 'all'
  );

  const isLoading = productsLoading || customersLoading;

  // Debug logs
  console.log('Dashboard Debug:', {
    user: user?.id,
    productsLoading,
    customersLoading,
    productsCount: products?.length,
    customersCount: customers?.length,
    products,
    customers
  });

  // Calculate dashboard metrics
  const dashboardData = useMemo(() => {
    // Check if data exists and is an array
    if (!customers || !products || !Array.isArray(customers) || !Array.isArray(products)) {
      console.log('No data available:', { customers, products });
      return {
        totalRevenue: 0,
        totalSales: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        topSellingProduct: null,
        chartData: [],
        paymentMethodBreakdown: {},
        recentCustomers: [],
        lowStockList: [],
        productSalesCount: [],
      };
    }

    // Calculate total revenue and sales
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const totalSales = customers.length;

    // Calculate product statistics
    const totalProducts = products.length;
    const lowStockThreshold = 15;
    const lowStockList = products.filter(p => p.Stock < lowStockThreshold);
    const lowStockProducts = lowStockList.length;

    // Calculate product sales count
    const productSalesCount = {};
    customers.forEach(customer => {
      const purchasedProducts = JSON.parse(customer.productPurchased || '[]');
      purchasedProducts.forEach(product => {
        if (productSalesCount[product.$id]) {
          productSalesCount[product.$id].count += product.quantity || 1;
          productSalesCount[product.$id].revenue += product.price * (product.quantity || 1);
        } else {
          productSalesCount[product.$id] = {
            ...product,
            count: product.quantity || 1,
            revenue: product.price * (product.quantity || 1),
          };
        }
      });
    });

    // Find top selling product
    const topSellingProduct = Object.values(productSalesCount).sort((a, b) => b.count - a.count)[0] || null;

    // Payment method breakdown
    const paymentMethodBreakdown = customers.reduce((acc, customer) => {
      const method = customer.paymentMethod || 'Cash';
      acc[method] = (acc[method] || 0) + customer.totalSpent;
      return acc;
    }, {});

    // Prepare chart data
    const chartData = customers.map(customer => ({
      date: customer.date || customer.$createdAt,
      totalSpent: customer.totalSpent,
    }));

    // Recent customers (last 5)
    const recentCustomers = [...customers]
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
      .slice(0, 5);

    return {
      totalRevenue,
      totalSales,
      totalProducts,
      lowStockProducts,
      topSellingProduct,
      chartData,
      paymentMethodBreakdown,
      recentCustomers,
      lowStockList,
      productSalesCount: Object.values(productSalesCount).sort((a, b) => b.count - a.count),
    };
  }, [customers, products]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  console.log(dashboardData.productSalesCount)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your shop overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithPresets
            onChangeDate={setDateRange}
          />
          <Button
            variant="outline"
            onClick={() => setDateRange(null)}
            size="sm"
          >
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IconCash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{dashboardData.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {!dateRange ? 'All time' : 'Selected period'}
                </p>
              </CardContent>
            </Card>

            {/* Total Sales Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  {!dateRange ? 'All transactions' : 'Period transactions'}
                </p>
              </CardContent>
            </Card>

            {/* Total Products Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <IconPackage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  In inventory
                </p>
              </CardContent>
            </Card>

            {/* Best Product Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Product</CardTitle>
                <IconBrandProducthunt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {dashboardData.topSellingProduct ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={dashboardData.topSellingProduct.productImage}
                      alt={dashboardData.topSellingProduct.productName}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-lg font-bold truncate">{dashboardData.topSellingProduct.productName}</div>
                      <p className="text-xs text-muted-foreground">
                        {dashboardData.topSellingProduct.count} units sold
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold">N/A</div>
                    <p className="text-xs text-muted-foreground">No sales yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert & Payment Methods */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Low Stock Alert */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconAlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Products with stock less than 15</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.lowStockList && dashboardData.lowStockList.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {dashboardData.lowStockList.map((product) => (
                      <div key={product.$id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{product.productName}</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">₹{product.price}</p>
                            <Badge variant="destructive" className="ml-2">
                              Stock: {product.Stock}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">All products are well stocked!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods Breakdown */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconCreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Revenue breakdown by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(dashboardData.paymentMethodBreakdown).map(([method, amount]) => {
                    const percentage = (amount / dashboardData.totalRevenue) * 100;
                    return (
                      <div key={method} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{method}</span>
                          <span className="text-sm font-bold">₹{amount.toFixed(2)}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    );
                  })}
                  {Object.keys(dashboardData.paymentMethodBreakdown).length === 0 && (
                    <p className="text-muted-foreground">No payment data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart & Recent Sales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Revenue Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Your revenue trend over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AreaChart1 chartData={dashboardData.chartData} date={dateRange || 'all'} />
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Recent />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {/* Product Sales Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Performance</CardTitle>
              <CardDescription>Detailed breakdown of all product sales</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg. Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.productSalesCount?.map((product) => (
                    <TableRow key={product.$id}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="text-right">{product.count}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{product.revenue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{(product.revenue / product.count).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!dashboardData.productSalesCount || dashboardData.productSalesCount.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{dashboardData.totalSales > 0 
                    ? (dashboardData.totalRevenue / dashboardData.totalSales).toFixed(2)
                    : '0.00'}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalSales}</div>
                <p className="text-xs text-muted-foreground">Unique transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.productSalesCount?.reduce((sum, p) => sum + p.count, 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total units</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          {/* Low Stock Alert */}
          {dashboardData.lowStockProducts > 0 && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <IconAlertTriangle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>These products need immediate restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {dashboardData.lowStockList?.map((product) => (
                      <TableRow key={product.$id}>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="text-right font-bold text-destructive">
                          {product.Stock}
                        </TableCell>
                        <TableCell className="text-right">₹{product.price}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Low Stock</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* All Products Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Complete list of all products in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product.$id}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {product.Stock}
                      </TableCell>
                      <TableCell className="text-right">₹{product.price}</TableCell>
                      <TableCell>
                        {product.Stock < 15 ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : product.Stock < 50 ? (
                          <Badge variant="outline">Medium</Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!products || products.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No products available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
