import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Heart, Phone, User, Calendar, MessageSquare, Trash2, FileImage, Download } from 'lucide-react';

interface Donation {
    id: number;
    amount: string;
    notes: string | null;
    proof_of_payment_path: string | null;
    status: string;
    donation_date: string;
    created_at: string;
}

interface Donor {
    id: number;
    full_name: string;
    whatsapp_number: string;
    membership_category: string;
    total_donations: string;
    donation_count: number;
    created_at: string;
    donations: Donation[];
}

interface ShowDonorProps {
    donor: Donor;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Donatur', href: '/donors' },
    { title: 'Detail Donatur', href: '#' },
];

export default function ShowDonor({ donor }: ShowDonorProps) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getCategoryBadgeColor = (cat: string) => {
        const colors: Record<string, string> = {
            'Yayasan': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800',
            'PCNU': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
            'MWCNU': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
            'Umum': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800',
        };
        return colors[cat] || colors['Umum'];
    };

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            'confirmed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
            'cancelled': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || colors['confirmed'];
    };

    const getStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            'confirmed': 'Dikonfirmasi',
            'pending': 'Menunggu',
            'cancelled': 'Dibatalkan',
        };
        return statusTexts[status] || status;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${donor.full_name} - Detail Donatur`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <User className="w-6 h-6 text-teal-600" />
                            {donor.full_name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Detail donatur dan riwayat donasi
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('donors.edit', donor.id)}>
                            <Button className="bg-teal-600 hover:bg-teal-700">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Donatur
                            </Button>
                        </Link>
                        <Link href={route('donors.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Donor Information */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-teal-600" />
                                    Informasi Donatur
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Nama Lengkap
                                    </label>
                                    <p className="text-lg font-medium text-slate-800 dark:text-white">
                                        {donor.full_name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Nomor WhatsApp
                                    </label>
                                    <p className="text-slate-800 dark:text-white">
                                        {donor.whatsapp_number}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Kategori Keanggotaan
                                    </label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryBadgeColor(donor.membership_category)}`}>
                                            {donor.membership_category}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Bergabung Sejak
                                    </label>
                                    <p className="text-slate-800 dark:text-white">
                                        {formatDate(donor.created_at)}
                                    </p>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                Total Donasi
                                            </label>
                                            <p className="text-2xl font-bold text-teal-600">
                                                {formatCurrency(donor.total_donations)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                Jumlah Transaksi
                                            </label>
                                            <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                                {donor.donation_count}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start" disabled>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Kirim WhatsApp (Segera)
                                </Button>
                                <Link href={route('donors.edit', donor.id)} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Data Donatur
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                                    disabled
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus Donatur
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Donation History */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Heart className="w-5 h-5 text-teal-600" />
                                            Riwayat Donasi
                                        </CardTitle>
                                        <CardDescription>
                                            {donor.donations.length} transaksi donasi
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>
                                        Tambah Donasi
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {donor.donations.length > 0 ? (
                                    <div className="space-y-4">
                                        {donor.donations.map((donation) => (
                                            <div 
                                                key={donation.id} 
                                                className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="text-lg font-semibold text-teal-600">
                                                                {formatCurrency(donation.amount)}
                                                            </p>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(donation.status)}`}>
                                                                {getStatusText(donation.status)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {formatDate(donation.donation_date)}
                                                            </span>
                                                            <span>
                                                                Dicatat: {formatDate(donation.created_at)}
                                                            </span>
                                                        </div>

                                                        {donation.notes && (
                                                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <strong>Catatan:</strong> {donation.notes}
                                                            </div>
                                                        )}

                                                        {donation.proof_of_payment_path && (
                                                            <div className="mt-2">
                                                                <a 
                                                                    href={`/storage/${donation.proof_of_payment_path}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                                                                >
                                                                    <FileImage className="w-4 h-4" />
                                                                    Lihat Bukti Pembayaran
                                                                    <Download className="w-3 h-3" />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <Button variant="ghost" size="sm" disabled>
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                                            Belum ada riwayat donasi
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-500 mb-4">
                                            Donatur ini belum memiliki riwayat donasi.
                                        </p>
                                        <Button variant="outline" disabled>
                                            <Heart className="w-4 h-4 mr-2" />
                                            Tambah Donasi Pertama
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}