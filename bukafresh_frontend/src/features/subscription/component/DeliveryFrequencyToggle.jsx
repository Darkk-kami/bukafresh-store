import { Truck, Calendar, Info } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export function DeliveryFrequencyToggle({ value, onChange }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-muted rounded-full p-1">
          <button
            type="button"
            onClick={() => onChange('weekly')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all',
              value === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Truck className="w-4 h-4" />
            Weekly Delivery
          </button>

          <button
            type="button"
            onClick={() => onChange('monthly')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all',
              value === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Calendar className="w-4 h-4" />
            Monthly Delivery
          </button>
        </div>
      </div>

      {/* Frequency Info */}
      <div className="flex justify-center">
        <div
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm',
            value === 'weekly'
              ? 'bg-primary/10 text-primary'
              : 'bg-green-100 text-green-700'
          )}
        >
          <Info className="w-4 h-4" />
          {value === 'weekly'
            ? 'Get fresh goods like fruits & vegetables every week'
            : 'Lower price - Great for non-perishables'}
        </div>
      </div>

      {/* Billing Note */}
      <p className="text-center text-sm text-muted-foreground">
        All subscriptions are billed monthly
      </p>
    </div>
  );
}
