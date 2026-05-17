'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  Calendar, 
  ShieldAlert,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import api from '@/lib/api';
import { exportToCSV } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const chartData = [
  { name: 'Engineering', completion: 85 },
  { name: 'Sales', completion: 65 },
  { name: 'Marketing', completion: 45 },
  { name: 'Product', completion: 90 },
  { name: 'HR', completion: 100 },
];

const pieData = [
  { name: 'Approved', value: 45, color: '#10b981' },
  { name: 'Pending', value: 30, color: '#6366f1' },
  { name: 'Draft', value: 15, color: '#f59e0b' },
  { name: 'Overdue', value: 10, color: '#ef4444' },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 150,
    activeCycles: 1,
    pendingApprovals: 12,
    completionRate: '72%'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      toast({
        title: 'Preparing Export',
        description: 'Your report is being generated...',
      });

      const response = await api.get('/admin/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Goal_Portal_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'Export Complete',
        description: 'The CSV report has been downloaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Could not generate the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Governance Console</h1>
            <p className="text-slate-500 mt-1">Monitor organization-wide performance and system health.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-11 shadow-sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-indigo-600 h-11 shadow-lg shadow-indigo-200">
              <Plus className="w-4 h-4 mr-2" />
              Create Cycle
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Employees</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12 this month
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Global Completion</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.completionRate}</p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[72%]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingApprovals}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-amber-600 font-medium">
                Action required in 4 departments
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">System Status</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">Healthy</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500 font-medium">
                All services operational
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Department Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="completion" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Goal Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 ml-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
