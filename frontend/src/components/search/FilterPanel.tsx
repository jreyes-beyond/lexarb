import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  status: string[];
  onStatusChange: (status: string[]) => void;
  statuses: FilterOption[];
  types: FilterOption[];
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  statuses,
  types,
  selectedTypes,
  onTypesChange,
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Label>Date Range</Label>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !dateRange.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((statusOption) => (
            <Badge
              key={statusOption.value}
              variant={status.includes(statusOption.value) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                if (status.includes(statusOption.value)) {
                  onStatusChange(status.filter((s) => s !== statusOption.value));
                } else {
                  onStatusChange([...status, statusOption.value]);
                }
              }}
            >
              {statusOption.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Case Type</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              {selectedTypes.length > 0 ? (
                <>{selectedTypes.length} selected</>
              ) : (
                'Select types'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search types..." />
              <CommandEmpty>No type found.</CommandEmpty>
              <CommandGroup>
                {types.map((type) => (
                  <CommandItem
                    key={type.value}
                    onSelect={() => {
                      if (selectedTypes.includes(type.value)) {
                        onTypesChange(
                          selectedTypes.filter((t) => t !== type.value)
                        );
                      } else {
                        onTypesChange([...selectedTypes, type.value]);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedTypes.includes(type.value)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {type.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};