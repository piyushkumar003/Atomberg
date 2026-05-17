'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Plus,
  Send,
  MessageSquare
} from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    pending: 12,
    approvedToday: 5,
    returned: 2,
    overdue: 4
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: '1', user: 'John Doe', action: 'submitted goals', time: '10m ago', status: 'PENDING' },
    { id: '2', user: 'Alice Smith', action: 'updated check-in', time: '1h ago', status: 'UPDATED' },
    { id: '3', user: 'Bob Wilson', action: 'requested review', time: '3h ago', status: 'REVIEW' },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manager Hub</h1>
            <p className="text-slate-500 mt-1">Manage team goals and approve performance sheets.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-11">
              Team Overview
            </Button>
            <Button className="bg-indigo-600 h-11">
              Review All Pending
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm bg-indigo-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-indigo-600/70 uppercase tracking-wider">Pending Approvals</p>
                  <p className="text-4xl font-black text-indigo-900 mt-2">{stats.pending}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-emerald-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-emerald-600/70 uppercase tracking-wider">Approved Today</p>
                  <p className="text-4xl font-black text-emerald-900 mt-2">{stats.approvedToday}</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-amber-600/70 uppercase tracking-wider">Returned</p>
                  <p className="text-4xl font-black text-amber-900 mt-2">{stats.returned}</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-red-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-red-600/70 uppercase tracking-wider">Overdue Check-ins</p>
                  <p className="text-4xl font-black text-red-900 mt-2">{stats.overdue}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Goals Progress */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Team Progress
            </h2>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Goal Submissions</CardTitle>
                <CardDescription>Direct reports who recently submitted their goal sheets for review.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="py-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {activity.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{activity.user}</p>
                          <p className="text-sm text-slate-500">{activity.action} • {activity.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {activity.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Review <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Quick Connect</h2>
            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-slate-400">Send a quick nudge to employees with pending goals.</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 border-none">
                  <Send className="w-4 h-4 mr-2" />
                  Nudge All
                </Button>
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Team Broadcast
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Cycle Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Submission Rate</span>
                  <span className="font-bold text-slate-900">85%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Approval Completion</span>
                  <span className="font-bold text-slate-900">62%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[62%]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
