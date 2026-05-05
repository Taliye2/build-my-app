import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES, formatPhone } from '@/lib/formHelpers';

export interface AddressValue {
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
}

interface AddressFieldsProps {
  value: AddressValue;
  onChange: (next: AddressValue) => void;
  showCountry?: boolean;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({ value, onChange, showCountry = false }) => {
  const set = (patch: Partial<AddressValue>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-3 rounded-md border border-border/60 p-3 bg-muted/20">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</p>
      <div>
        <Label className="text-xs">Street Address</Label>
        <Input value={value.street_address || ''} onChange={e => set({ street_address: e.target.value })} placeholder="123 Main St" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">City</Label>
          <Input value={value.city || ''} onChange={e => set({ city: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">State</Label>
          <Select value={value.state || ''} onValueChange={v => set({ state: v })}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent className="max-h-64">
              {US_STATES.map(([code, name]) => (
                <SelectItem key={code} value={code}>{code} — {name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">ZIP Code</Label>
          <Input value={value.zip_code || ''} onChange={e => set({ zip_code: e.target.value.replace(/[^\d-]/g, '').slice(0, 10) })} placeholder="12345" />
        </div>
        {showCountry && (
          <div>
            <Label className="text-xs">Country</Label>
            <Input value={value.country || 'US'} onChange={e => set({ country: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
};

interface PhoneInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
}
export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, placeholder = '(555) 123-4567', id }) => (
  <Input
    id={id}
    type="tel"
    inputMode="tel"
    value={value}
    onChange={e => onChange(formatPhone(e.target.value))}
    placeholder={placeholder}
  />
);