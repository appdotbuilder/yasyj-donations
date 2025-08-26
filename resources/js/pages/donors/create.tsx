import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Users, Phone, User } from 'lucide-react';

interface CreateDonorProps {
    categories: string[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Donatur', href: '/donors' },
    { title: 'Tambah Donatur', href: '/donors/create' },
];

export default function CreateDonor({ categories }: CreateDonorProps) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        whatsapp_number: '',
        membership_category: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('donors.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Donatur - Yayasan Anugerah Sehat" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-teal-600" />
                            Tambah Donatur Baru
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Tambahkan donatur baru ke dalam sistem
                        </p>
                    </div>
                    <Link href={route('donors.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-teal-600" />
                                Informasi Donatur
                            </CardTitle>
                            <CardDescription>
                                Isi informasi lengkap donatur yang akan ditambahkan
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
                                        {processing ? 'Menyimpan...' : 'Simpan Donatur'}
                                    </Button>
                                    <Link href={route('donors.index')}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6 bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-teal-800 dark:text-teal-200 mb-1">
                                        Informasi Penting
                                    </h3>
                                    <p className="text-sm text-teal-700 dark:text-teal-300">
                                        Setelah menambahkan donatur, Anda dapat mengelola riwayat donasi mereka 
                                        dan mengirim notifikasi WhatsApp untuk pengingat atau ucapan terima kasih.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}