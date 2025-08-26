import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Eye, Edit, Trash2, Users, Heart, Phone } from 'lucide-react';
import { useState } from 'react';

interface Donor {
    id: number;
    full_name: string;
    whatsapp_number: string;
    membership_category: string;
    total_donations: string;
    donation_count: number;
    created_at: string;
}

interface DonorsIndexProps {
    donors: {
        data: Donor[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: string[];
    filters: {
        search?: string;
        category?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Donatur', href: '/donors' },
];

export default function DonorsIndex({ donors, categories, filters }: DonorsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');

    const handleSearch = () => {
        router.get(route('donors.index'), { 
            search: search || undefined, 
            category: category !== 'all' ? category : undefined 
        });
    };

    const handleDelete = (donor: Donor) => {
        if (confirm(`Yakin ingin menghapus donatur ${donor.full_name}?`)) {
            router.delete(route('donors.destroy', donor.id));
        }
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(parseFloat(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getCategoryBadgeColor = (cat: string) => {
        const colors: Record<string, string> = {
            'Yayasan': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'PCNU': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'MWCNU': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'Umum': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[cat] || colors['Umum'];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Donatur - Yayasan Anugerah Sehat" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-teal-600" />
                            Kelola Donatur
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Total {donors.total} donatur terdaftar
                        </p>
                    </div>
                    <Link href={route('donors.create')}>
                        <Button className="bg-teal-600 hover:bg-teal-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Donatur
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                        <CardDescription>Cari donatur berdasarkan nama atau filter berdasarkan kategori</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Cari nama atau nomor WhatsApp..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch} className="bg-teal-600 hover:bg-teal-700">
                                <Search className="w-4 h-4 mr-2" />
                                Cari
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Donors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donors.data.map((donor) => (
                        <Card key={donor.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg text-slate-800 dark:text-white">
                                            {donor.full_name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3" />
                                            {donor.whatsapp_number}
                                        </CardDescription>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(donor.membership_category)}`}>
                                        {donor.membership_category}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            Total Donasi
                                        </span>
                                        <span className="font-semibold text-teal-600">
                                            {formatCurrency(donor.total_donations)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            Jumlah Donasi
                                        </span>
                                        <span className="font-medium">
                                            {donor.donation_count}x
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            Bergabung
                                        </span>
                                        <span className="text-sm">
                                            {formatDate(donor.created_at)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <Link href={route('donors.show', donor.id)} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="w-3 h-3 mr-1" />
                                            Detail
                                        </Button>
                                    </Link>
                                    <Link href={route('donors.edit', donor.id)} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleDelete(donor)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {donors.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {donors.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={link.active ? "bg-teal-600 hover:bg-teal-700" : ""}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {donors.data.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Tidak ada donatur ditemukan
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500 mb-4">
                                {filters.search || filters.category ? 'Coba ubah kriteria pencarian atau filter.' : 'Mulai dengan menambahkan donatur pertama.'}
                            </p>
                            <Link href={route('donors.create')}>
                                <Button className="bg-teal-600 hover:bg-teal-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Donatur
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}