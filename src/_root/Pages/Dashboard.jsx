import ProfileNotify from '@/components/Shared/ProfileNotify';
import AreaChart from '@/components/Dashboard/AreaChart';
import Recent from '@/components/Dashboard/Recent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithPresets } from '@/components/ui/DatePicker';

const Dashboard = () => {
  // Mock data for summary statistics
  const summaryStats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month' },
    { title: 'Subscriptions', value: '+2,350', change: '+180.1% from last month' },
    { title: 'Sales', value: '12,234', change: '+19% from last month' },
    { title: 'Active Now', value: '573', change: '+3 since last hour' },
  ];

  // Mock data for the AreaChart component
  const chartData = [
    { name: 'Jan', total: 4000 },
    { name: 'Feb', total: 3000 },
    { name: 'Mar', total: 2000 },
    { name: 'Apr', total: 2780 },
    { name: 'May', total: 1890 },
    { name: 'Jun', total: 2390 },
    { name: 'Jul', total: 3490 },
    { name: 'Aug', total: 4200 },
    { name: 'Sep', total: 3800 },
    { name: 'Oct', total: 4500 },
    { name: 'Nov', total: 3000 },
    { name: 'Dec', total: 5000 },
  ];

  // Placeholder function for date picker change
  const handleDateChange = (date) => {
    console.log('Selected date range:', date);
    // In a real application, this would trigger data fetching or filtering
  };

  return (
    <div className='min-h-screen w-full p-4 md:p-8 dark:bg-neutral-950 flex flex-col gap-6'>
      {/* Header Section */}
      <div className='flex w-full justify-between items-center mb-4'>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <div className='flex items-center gap-2'>
          <DatePickerWithPresets onChangeDate={handleDateChange} />
          <ProfileNotify />
        </div>
      </div>

      {/* Summary Statistics Section */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {summaryStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className='p-4 pb-0'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-2'>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-muted-foreground'>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts and Recent Activity Section */}
      <div className='grid gap-4 lg:grid-cols-7'>
        {/* Overview Chart */}
        <Card className='col-span-4'>
          <CardHeader className='p-4 pb-0'>
            <CardTitle className='text-sm font-medium'>Overview</CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <AreaChart data={chartData} />
          </CardContent>
        </Card>

        {/* Recent Sales Activity */}
        <Card className='col-span-3'>
          <CardHeader className='p-4 pb-0'>
            <CardTitle className='text-sm font-medium'>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <Recent />
          </CardContent>
        </Card>
      </div>

      {/* Second Chart Placeholder Section */}
      <div className='grid gap-4'>
        <Card>
          <CardHeader className='p-4 pb-0'>
            <CardTitle className='text-sm font-medium'>Detailed Sales Trends</CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='h-[200px] flex items-center justify-center text-muted-foreground'>
              {/* This is a placeholder for a second chart, e.g., a BarChart or LineChart */}
              Placeholder for another chart component (e.g., from src/components/ui/chart.jsx)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;