'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function EmployeeDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Goals', value: '5', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Weightage', value: '85%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Pending Review', value: '2', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Completed', value: '1', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
            <p className="text-slate-500 mt-1">Here's an overview of your goals for the current cycle.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-lg shadow-indigo-200">
            <Plus className="w-5 h-5 mr-2" />
            Create New Goal
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Goals Table (Mockup) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Active Goals</h2>
              <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal Title</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Weightage</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">Increase Sales Conversion</p>
                          <p className="text-xs text-slate-500">Sales & Marketing</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">20%</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Approved
                          </span>
                        </td>
                        <td className="px-6 py-4 min-w-[120px]">
                          <div className="flex items-center gap-3">
                            <Progress value={65} className="h-2 flex-1" />
                            <span className="text-xs font-bold text-slate-700">65%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick Actions / Summary */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Cycle Summary</h2>
            <Card className="border-none shadow-sm bg-indigo-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">FY 2026 Q1</CardTitle>
                <CardDescription className="text-indigo-200">Deadline: June 30, 2026</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Completion</span>
                    <span className="font-bold">72%</span>
                  </div>
                  <Progress value={72} className="h-2 bg-indigo-800" indicatorClassName="bg-indigo-400" />
                </div>
                <Button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white border-none mt-4 shadow-lg shadow-indigo-950/20">
                  Update Progress
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Jane Manager • 2h ago</p>
                        <p className="text-sm text-slate-700 mt-1">"Great progress on the sales goal! Keep it up."</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
