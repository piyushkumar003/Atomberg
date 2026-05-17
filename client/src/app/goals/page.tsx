'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Send, 
  Trash2, 
  Edit2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Target
} from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cycleRes = await api.get('/goals/cycles/active');
      setActiveCycle(cycleRes.data);
      
      const goalsRes = await api.get('/goals/my', {
        params: { cycleId: cycleRes.data.id }
      });
      setGoals(goalsRes.data);
    } catch (error) {
      // Mocking for demo if backend not ready
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);

  const handleSubmitSheet = async () => {
    if (totalWeightage !== 100) {
      toast({
        variant: 'destructive',
        title: 'Invalid weightage',
        description: `Total weightage must be exactly 100%. Current: ${totalWeightage}%`,
      });
      return;
    }

    try {
      await api.post('/goals/submit', { cycleId: activeCycle.id });
      toast({
        title: 'Success',
        description: 'Goal sheet submitted for approval.',
      });
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: error.response?.data?.message || 'Failed to submit goals.',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Goals</h1>
            <p className="text-slate-500 mt-1">
              Cycle: <span className="font-semibold text-slate-700">{activeCycle?.name || 'Current Quarter'}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-slate-200 h-11"
              onClick={handleSubmitSheet}
              disabled={goals.length === 0 || goals.some(g => g.status !== 'DRAFT')}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Sheet
            </Button>
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-lg shadow-indigo-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-indigo-50 rounded-full mb-4">
                    <Target className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Define Your Performance Target</h4>
                  <p className="text-sm text-slate-500 max-w-sm mt-2">
                    Enter the goal title, thrust area, and target value. Ensure the weightage adds up to 100%.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Weightage Summary */}
        <Card className={cn(
          "border-none shadow-sm transition-colors",
          totalWeightage === 100 ? "bg-emerald-50/50" : "bg-amber-50/50"
        )}>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl shadow-sm",
                totalWeightage === 100 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              )}>
                {totalWeightage === 100 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Weightage</p>
                <p className={cn(
                  "text-3xl font-black",
                  totalWeightage === 100 ? "text-emerald-700" : "text-amber-700"
                )}>
                  {totalWeightage}% <span className="text-sm font-medium opacity-60">/ 100%</span>
                </p>
              </div>
            </div>
            <div className="hidden md:block w-72">
              <Progress 
                value={totalWeightage} 
                className="h-3 bg-white/50" 
                indicatorClassName={totalWeightage === 100 ? "bg-emerald-500" : "bg-amber-500"} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="border-none shadow-sm p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState 
            icon={Target}
            title="No goals created yet"
            description="Start by adding your first performance goal for this cycle. Ensure your total weightage reaches 100% before submission."
            actionLabel="Add Your First Goal"
            onAction={() => {}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="border-none shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <Badge variant="outline" className="mb-2 uppercase tracking-widest text-[9px] font-bold border-slate-200 text-slate-500">
                      {goal.thrust_area}
                    </Badge>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {goal.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-slate-600 leading-relaxed min-h-[40px]">
                    {goal.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Target Value</p>
                      <p className="text-xl font-black text-slate-900">{goal.target_value} <span className="text-xs font-medium text-slate-500">{goal.uom_type}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Weightage</p>
                      <p className="text-2xl font-black text-indigo-600">{goal.weightage}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        "rounded-full font-bold text-[10px] px-3",
                        goal.status === 'DRAFT' ? "bg-slate-100 text-slate-600" :
                        goal.status === 'SUBMITTED' ? "bg-blue-100 text-blue-600" :
                        goal.status === 'APPROVED' ? "bg-emerald-100 text-emerald-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated {new Date(goal.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
