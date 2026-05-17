'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  History, 
  User, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would hit /admin/audit-logs
      // For demo, we'll mock if it fails or use a placeholder
      const response = await api.get('/admin/audit-logs').catch(() => ({ data: mockLogs }));
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const mockLogs = [
    { id: '1', actor: 'Admin User', action: 'CREATE_CYCLE', entity: 'GoalCycle', timestamp: new Date().toISOString(), details: 'Created FY2026 Q2', before: '-', after: 'FY2026 Q2' },
    { id: '2', actor: 'Sarah Manager', action: 'APPROVE_GOAL', entity: 'GoalApproval', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Approved: Increase Sales', before: 'SUBMITTED', after: 'APPROVED' },
    { id: '3', actor: 'John Employee', action: 'SUBMIT_GOALS', entity: 'Goal', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Submitted 5 goals', before: 'DRAFT', after: 'SUBMITTED' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Timeline</h1>
            <p className="text-slate-500 mt-1">Immutable record of all system activity and data mutations.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              Refresh
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by actor, action or entity..." 
                  className="pl-10 h-10 border-slate-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Change (Before/After)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-xs text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{log.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-[10px] uppercase bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        {log.entity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">{log.before}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">{log.after}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs text-slate-500 font-medium">Showing {logs.length} of {logs.length} entries</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
