import { useState } from 'react';
import { Button } from '@/shared/ui/buttons';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    street: initialData?.street || '',
    city: initialData?.city || 'Lagos',
    state: initialData?.state || 'Lagos',
    postalCode: initialData?.postalCode || '',
    instructions: initialData?.instructions || '',
    isDefault: initialData?.isDefault || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.street && formData.city) {
      onSubmit({
        label: formData.label || 'New Address',
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        isDefault: formData.isDefault,
        instructions: formData.instructions,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-xl p-6 space-y-4"
    >
      <h3 className="font-medium text-foreground">
        {initialData ? 'Edit Address' : 'New Delivery Address'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="label">Address Label</Label>
          <Input
            id="label"
            placeholder="e.g., Home, Office"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
          />
        </div>

        {/* Street */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            placeholder="Enter your street address"
            value={formData.street}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
            required
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="Lagos"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            required
          />
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            placeholder="101233"
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
          />
        </div>

        {/* Instructions */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="instructions">
            Delivery Instructions (Optional)
          </Label>
          <Input
            id="instructions"
            placeholder="e.g., Call when at the gate"
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button type="submit" variant="default" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
}
