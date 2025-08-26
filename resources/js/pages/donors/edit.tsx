import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, User, Phone, Heart } from 'lucide-react';

interface Donor {
    id: number;
    full_name: string;
    whatsapp_number: string;
    membership_category: string;
    total_donations: string;
    donation_count: number;
}

interface EditDonorProps {
    donor: Donor;
    categories: string[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Donatur', href: '/donors' },
    { title: 'Edit Donatur', href: '#' },
];

export default function EditDonor({ donor, categories }: EditDonorProps) {
    const { data, setData, put, processing, errors } = useForm({
        full_name: donor.full_name,
        whatsapp_number: donor.whatsapp_number,
        membership_category: donor.membership_category,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('donors.update', donor.id));
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(parseFloat(amount));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${donor.full_name} - Donatur`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <User className="w-6 h-6 text-teal-600" />
                            Edit Donatur: {donor.full_name}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Perbarui informasi donatur
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('donors.show', donor.id)}>
                            <Button variant="outline">
                                Detail Donatur
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
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-teal-600" />
                                    Informasi Donatur
                                </CardTitle>
                                <CardDescription>
                                    Perbarui data donatur di bawah ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">Nama Lengkap *</Label>
                                        <Input
                                            id="full_name"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            placeholder="Masukkan nama lengkap donatur"
                                            className={errors.full_name ? 'border-red-500' : ''}
                                        />
                                        {errors.full_name && (
                                            <p className="text-red-500 text-sm">{errors.full_name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp_number">Nomor WhatsApp *</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <Input
                                                id="whatsapp_number"
                                                value={data.whatsapp_number}
                                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                                placeholder="Contoh: 0812-3456-7890"
                                                className={`pl-10 ${errors.whatsapp_number ? 'border-red-500' : ''}`}
                                            />
                                        </div>
                                        {errors.whatsapp_number && (
                                            <p className="text-red-500 text-sm">{errors.whatsapp_number}</p>
                                        )}
                                        <p className="text-xs text-slate-500">
                                            Format: 08xx-xxxx-xxxx atau +62xxx-xxxx-xxxx
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="membership_category">Kategori Keanggotaan *</Label>
                                        <Select 
                                            value={data.membership_category} 
                                            onValueChange={(value) => setData('membership_category', value)}
                                        >
                                            <SelectTrigger className={errors.membership_category ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih kategori keanggotaan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.membership_category && (
                                            <p className="text-red-500 text-sm">{errors.membership_category}</p>
                                        )}
                                        <div className="text-xs text-slate-500 space-y-1">
                                            <p><strong>Yayasan:</strong> Anggota internal yayasan</p>
                                            <p><strong>PCNU:</strong> Pengurus Cabang Nahdlatul Ulama</p>
                                            <p><strong>MWCNU:</strong> Majelis Wakil Cabang Nahdlatul Ulama</p>
                                            <p><strong>Umum:</strong> Donatur dari masyarakat umum</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-teal-600 hover:bg-teal-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                        <Link href={route('donors.show', donor.id)}>
                                            <Button type="button" variant="outline">
                                                Batal
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Donor Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-teal-600" />
                                    Ringkasan Donatur
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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

                                <div className="pt-4 border-t">
                                    <p className="text-xs text-slate-500">
                                        Data donasi akan tetap tersimpan setelah informasi donatur diperbarui.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning Card */}
                        <Card className="mt-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                                            Perhatian
                                        </h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            Perubahan nomor WhatsApp akan memengaruhi pengiriman notifikasi 
                                            kepada donatur ini.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}