import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, Heart, TrendingUp, MessageSquare, Eye, Plus, Calendar } from 'lucide-react';
import { SimpleBarChart } from '@/components/simple-bar-chart';
import { SimplePieChart } from '@/components/simple-pie-chart';

interface DashboardProps {
    statistics: {
        total_donors: number;
        donors_this_month: number;
        total_donations: number;
        donations_this_month: number;
        new_inquiries: number;
        total_inquiries: number;
    };
    recent_donations: Array<{
        id: number;
        amount: string;
        donation_date: string;
        donor: {
            full_name: string;
            membership_category: string;
        };
    }>;
    top_donors: Array<{
        id: number;
        full_name: string;
        total_donations: string;
        donation_count: number;
        membership_category: string;
    }>;
    monthly_trends: Array<{
        month: string;
        amount: number;
        count: number;
    }>;
    category_breakdown: Array<{
        membership_category: string;
        count: number;
        total_amount: string;
    }>;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];



export default function Dashboard({ statistics, recent_donations, top_donors, monthly_trends, category_breakdown }: DashboardProps) {
    const formatCurrency = (amount: string | number) => {
        const value = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard - Yayasan Anugerah Sehat" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                
                {/* Header with Quick Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Admin</h1>
                        <p className="text-slate-600 dark:text-slate-400">Kelola program donasi Yayasan Anugerah Sehat</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('donors.create')}>
                            <Button className="bg-teal-600 hover:bg-teal-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Donatur
                            </Button>
                        </Link>
                        <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Publik
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <Card className="col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Donatur</CardTitle>
                                <Users className="h-4 w-4 text-teal-600" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                {statistics.total_donors.toLocaleString('id-ID')}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                                +{statistics.donors_this_month} donatur baru bulan ini
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Donasi</CardTitle>
                                <Heart className="h-4 w-4 text-teal-600" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(statistics.total_donations)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                                {formatCurrency(statistics.donations_this_month)} bulan ini
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Inquiri Baru</CardTitle>
                                <MessageSquare className="h-4 w-4 text-teal-600" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                {statistics.new_inquiries}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                dari {statistics.total_inquiries} total inquiri
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-600" />
                                Tren Donasi Bulanan
                            </CardTitle>
                            <CardDescription>Perkembangan donasi 6 bulan terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <SimpleBarChart data={monthly_trends} height={300} color="#0d9488" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-teal-600" />
                                Sebaran Kategori Donatur
                            </CardTitle>
                            <CardDescription>Distribusi berdasarkan kategori keanggotaan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <SimplePieChart data={category_breakdown} height={300} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity & Top Donors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Donasi Terbaru</CardTitle>
                                <Link href={route('donors.index')}>
                                    <Button variant="outline" size="sm">Lihat Semua</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent_donations.map((donation) => (
                                    <div key={donation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg dark:bg-slate-800">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{donation.donor.full_name}</p>
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                                                    {donation.donor.membership_category}
                                                </span>
                                                <span>{formatDate(donation.donation_date)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-teal-600">{formatCurrency(donation.amount)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Top Donatur</CardTitle>
                                <Link href={route('donors.index')}>
                                    <Button variant="outline" size="sm">Kelola Donatur</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {top_donors.map((donor, index) => (
                                    <div key={donor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg dark:bg-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{donor.full_name}</p>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                                                        {donor.membership_category}
                                                    </span>
                                                    <span>{donor.donation_count}x donasi</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-teal-600">{formatCurrency(donor.total_donations)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                        <CardDescription>Fitur-fitur utama untuk mengelola program donasi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href={route('donors.index')}>
                                <div className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                    <Users className="w-8 h-8 text-teal-600 mb-2" />
                                    <h3 className="font-medium text-slate-900 dark:text-white">Kelola Donatur</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Tambah, edit, dan lihat data donatur</p>
                                </div>
                            </Link>
                            
                            <div className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors opacity-75">
                                <MessageSquare className="w-8 h-8 text-teal-600 mb-2" />
                                <h3 className="font-medium text-slate-900 dark:text-white">WhatsApp Blast</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Kirim notifikasi ke donatur (Segera)</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors opacity-75">
                                <TrendingUp className="w-8 h-8 text-teal-600 mb-2" />
                                <h3 className="font-medium text-slate-900 dark:text-white">Laporan Lengkap</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Export data dan analisis (Segera)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}