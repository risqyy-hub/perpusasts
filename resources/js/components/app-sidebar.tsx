import { Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    BarChart3,
    BookOpen,
    FileDown,
    FileText,
    LayoutGrid,
    LogOut,
    Moon,
    PlusCircle,
    Server,
    Sun,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { downloadFile } from '@/lib/export';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Data Buku',
        href: '/books',
        icon: BookOpen,
    },
    {
        title: 'Tambah Buku',
        href: '/books/create',
        icon: PlusCircle,
    },
    {
        title: 'Statistik',
        href: '/statistics',
        icon: BarChart3,
    },
    {
        title: 'API',
        href: '/api',
        icon: Server,
    },
];

const exportItems: { title: string; href: string; icon: LucideIcon }[] = [
    { title: 'Export Excel', href: '/export/excel', icon: FileDown },
    { title: 'Export PDF', href: '/export/pdf', icon: FileText },
];

export function AppSidebar() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const handleExport = (href: string, title: string) => {
        void toast.promise(downloadFile(href), {
            loading: `Menyiapkan ${title}...`,
            success: (filename: string) => `${filename} berhasil diunduh.`,
            error: (error: unknown) =>
                error instanceof Error
                    ? error.message
                    : `${title} gagal diunduh.`,
        });
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Menu Utama" />

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Export Data</SidebarGroupLabel>
                    <SidebarMenu>
                        {exportItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={{ children: item.title }}
                                    onClick={() =>
                                        handleExport(item.href, item.title)
                                    }
                                    data-test={`sidebar-${item.href.replace(/\//g, '-')}`}
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Lainnya</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: 'Profil' }}
                            >
                                <Link href="/profile">
                                    <User />
                                    <span>Profil</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() =>
                                    updateAppearance(
                                        resolvedAppearance === 'dark'
                                            ? 'light'
                                            : 'dark',
                                    )
                                }
                                tooltip={{
                                    children:
                                        resolvedAppearance === 'dark'
                                            ? 'Mode Terang'
                                            : 'Mode Gelap',
                                }}
                                data-test="theme-toggle"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun />
                                ) : (
                                    <Moon />
                                )}
                                <span>
                                    {resolvedAppearance === 'dark'
                                        ? 'Mode Terang'
                                        : 'Mode Gelap'}
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => router.post('/logout')}
                                tooltip={{ children: 'Logout' }}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                data-test="sidebar-logout"
                            >
                                <LogOut />
                                <span>Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
