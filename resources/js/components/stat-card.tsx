import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    hint?: string;
    className?: string;
};

export default function StatCard({
    title,
    value,
    icon: Icon,
    hint,
    className,
}: Props) {
    return (
        <Card className={cn('gap-2 rounded-2xl shadow-sm', className)}>
            <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight">
                        {value}
                    </p>
                    {hint && (
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                            {hint}
                        </p>
                    )}
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    );
}
