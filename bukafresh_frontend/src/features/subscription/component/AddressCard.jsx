import { MapPin, Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export function AddressCard({
  address,
  isSelected = false,
  onSelect,
  showActions = false,
  onEdit,
  onDelete,
}) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(address);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
        onSelect && 'cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 bg-card'
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <MapPin className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {address.label}
          </span>

          {address.isDefault && (
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              Default
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {address.street}, {address.city}
        </p>

        {address.instructions && (
          <p className="text-xs text-muted-foreground mt-1 italic">
            {address.instructions}
          </p>
        )}
      </div>

      {isSelected && (
        <Check className="w-5 h-5 text-primary shrink-0" />
      )}
    </div>
  );
}
