type InitialsFn = (name?: string | null) => string;

export function useInitials(): InitialsFn {
    return (name) => {
        if (!name) {
            return 'AD';
        }

        const initials = name
            .trim()
            .split(/\s+/)
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);

        return initials || 'AD';
    };
}
