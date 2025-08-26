import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Heart, Users, TrendingUp, Calculator, ArrowRight, Phone } from 'lucide-react';
import { useState } from 'react';
import { SimpleChart } from '@/components/simple-chart';

interface FlashMessages {
    success?: string;
}

interface PageProps {
    statistics: {
        total_donors: number;
        donors_this_month: number;
        total_donations: number;
        donations_this_month: number;
        average_donation: number;
    };
    donation_growth: Array<{
        month: string;
        amount: number;
    }>;
    donor_growth: Array<{
        month: string;
        count: number;
    }>;
    flash?: FlashMessages;
    [key: string]: unknown;
}

export default function Welcome({ statistics, donation_growth, donor_growth, flash }: PageProps) {
    const { auth } = usePage<SharedData>().props;
    const [showDonorForm, setShowDonorForm] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        whatsapp_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('donation-inquiry.store'), {
            onSuccess: () => {
                reset();
                setShowDonorForm(false);
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <>
            <Head title="Yayasan Anugerah Sehat Jepara - Donasi Berulang">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b dark:bg-slate-900/80 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-xl text-slate-800 dark:text-white">Yayasan Anugerah Sehat</h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">Jepara</p>
                                </div>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6 dark:bg-teal-900 dark:text-teal-200">
                            💚 Program Donasi Berulang Aktif
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 dark:text-white">
                            Membangun <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">Kesehatan</span>
                            <br />untuk Masa Depan
                        </h2>
                        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto dark:text-slate-300">
                            Bergabunglah dengan ribuan donatur yang telah mempercayai kami untuk menyalurkan bantuan kesehatan 
                            kepada masyarakat Jepara yang membutuhkan. Transparansi dan akuntabilitas adalah prioritas utama kami.
                        </p>
                        
                        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Jadilah Donatur
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-teal-600" />
                                        Bergabung sebagai Donatur
                                    </DialogTitle>
                                    <DialogDescription>
                                        Isi formulir di bawah ini dan tim kami akan menghubungi Anda untuk informasi lebih lanjut tentang program donasi berulang.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap Anda"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
                                        <Input
                                            id="whatsapp_number"
                                            value={data.whatsapp_number}
                                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                                            placeholder="08xx-xxxx-xxxx"
                                            required
                                        />
                                        {errors.whatsapp_number && <p className="text-red-500 text-sm mt-1">{errors.whatsapp_number}</p>}
                                    </div>
                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {processing ? 'Mengirim...' : 'Hubungi Saya'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>

                {/* Statistics Cards */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Donatur</CardTitle>
                                    <Users className="h-4 w-4 text-teal-600" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {statistics.total_donors.toLocaleString('id-ID')}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                                    +{statistics.donors_this_month} bulan ini
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Donasi</CardTitle>
                                    <Heart className="h-4 w-4 text-teal-600" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(statistics.total_donations)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                                    {formatCurrency(statistics.donations_this_month)} bulan ini
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Rata-rata Donasi</CardTitle>
                                    <Calculator className="h-4 w-4 text-teal-600" />
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(statistics.average_donation)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                    Per transaksi donasi
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-teal-500 to-green-500 text-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-teal-100">Dampak Bulan Ini</CardTitle>
                                <div className="text-2xl font-bold">
                                    {statistics.donors_this_month} keluarga
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-teal-100">
                                    Mendapat bantuan kesehatan
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Charts Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Tren Donasi (12 Bulan Terakhir)</CardTitle>
                                <CardDescription>Perkembangan total donasi yang terkumpul</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <SimpleChart data={donation_growth} type="amount" height={300} color="#0d9488" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">Pertumbuhan Donatur</CardTitle>
                                <CardDescription>Jumlah donatur baru setiap bulan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <SimpleChart data={donor_growth} type="count" height={300} color="#059669" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-teal-600 to-green-600 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            💚 Mari Bersama Membantu Sesama
                        </h3>
                        <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                            Setiap donasi Anda disalurkan dengan transparan dan memberikan dampak langsung 
                            kepada masyarakat yang membutuhkan bantuan kesehatan.
                        </p>
                        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
                            <DialogTrigger asChild>
                                <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-4 text-lg">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Mulai Berdonasi Sekarang
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center text-slate-600 dark:text-slate-400">
                            <p>&copy; 2024 Yayasan Anugerah Sehat Jepara. Seluruh donasi disalurkan dengan transparansi penuh.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}