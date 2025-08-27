import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Heart, Calendar } from 'lucide-react';
import React from 'react';

interface Donor {
    id: number;
    full_name: string;
    whatsapp_number: string;
}

interface CreateDonationProps {
    donors: Donor[];
    statuses: string[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pembayaran Donasi', href: '/donations/create' },
];

export default function CreateDonation({ donors, statuses }: CreateDonationProps) {
    const { data, setData, post, processing, errors } = useForm({
        donor_id: '',
        amount: '',
        notes: '',
        status: 'confirmed', // Default status to confirmed
        donation_date: new Date().toISOString().split('T')[0], // Default to today's date
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('donations.store'));
    };

    const formatCurrency = (value: string) => {
        // Remove non-numeric characters for internal storage/processing
        let numericValue = value.replace(/[^\d]/g, '');
        if (numericValue === '') return '';
        // Format for display
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(numericValue));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits
        setData('amount', value); // Store as plain number string
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Donasi - Yayasan Anugerah Sehat" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Heart className="w-6 h-6 text-teal-600" />
                            Input Pembayaran Donasi
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Catat donasi baru dari donatur yang sudah terdaftar
                        </p>
                    </div>
                    <Link href={route('dashboard')}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-600" />
                                Detail Donasi
                            </CardTitle>
                            <CardDescription>
                                Isi detail donasi yang diterima
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="donor_id">Pilih Donatur *</Label>
                                    <Select
                                        value={data.donor_id.toString()}
                                        onValueChange={(value) => setData('donor_id', value)}
                                    >
                                        <SelectTrigger className={errors.donor_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih donatur yang sudah terdaftar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {donors.map((donor) => (
                                                <SelectItem key={donor.id} value={donor.id.toString()}>
                                                    {donor.full_name} ({donor.whatsapp_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.donor_id && (
                                        <p className="text-red-500 text-sm">{errors.donor_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Jumlah Donasi *</Label>
                                    <Input
                                        id="amount"
                                        value={formatCurrency(data.amount)}
                                        onChange={handleAmountChange}
                                        placeholder="Rp 100.000"
                                        className={errors.amount ? 'border-red-500' : ''}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                    />
                                    {errors.amount && (
                                        <p className="text-red-500 text-sm">{errors.amount}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="donation_date">Tanggal Donasi *</Label>
                                    <Input
                                        id="donation_date"
                                        type="date"
                                        value={data.donation_date}
                                        onChange={(e) => setData('donation_date', e.target.value)}
                                        className={errors.donation_date ? 'border-red-500' : ''}
                                    />
                                    {errors.donation_date && (
                                        <p className="text-red-500 text-sm">{errors.donation_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Donasi *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih status donasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status === 'confirmed' ? 'Dikonfirmasi' : status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-red-500 text-sm">{errors.status}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Catatan (opsional)</Label>
                                    <textarea
                                        id="notes"
                                        value={data.notes || ''}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Tambahkan catatan donasi jika ada"
                                        rows={3}
                                        className={`flex h-auto w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 ${errors.notes ? 'border-red-500' : ''}`}
                                    />
                                    {errors.notes && (
                                        <p className="text-red-500 text-sm">{errors.notes}</p>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-teal-600 hover:bg-teal-700"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Menyimpan...' : 'Simpan Donasi'}
                                    </Button>
                                    <Link href={route('dashboard')}>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                        Informasi Donasi
                                    </h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Pastikan semua detail donasi diisi dengan benar. Setelah disimpan, donasi ini akan tercatat dalam riwayat donatur yang dipilih.
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