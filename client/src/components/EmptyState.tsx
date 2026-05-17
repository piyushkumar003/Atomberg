import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          className="mt-6 border-slate-200 hover:bg-white"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
