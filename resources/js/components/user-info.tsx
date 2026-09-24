import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const username = user?.username || 'Admin';

    const initials = username
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {initials || 'AD'}
                </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{username}</span>

                {showEmail && user?.username && (
                    <span className="truncate text-xs text-muted-foreground">
                        Administrator
                    </span>
                )}
            </div>
        </>
    );
}
