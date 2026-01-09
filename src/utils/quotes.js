export const AGRI_QUOTES = [
    "Pencatatan yang jujur dan teliti adalah fondasi utama menuju kemandirian serta transparansi dalam bertani.",
    "Pertanian adalah fondasi kemakmuran bangsa, mari jaga kesuburan tanah kita.",
    "Bekerja keras di ladang, bersyukur dengan hasil yang ada, itulah kuncinya tetap bahagia.",
    "Tanah yang subur adalah titipan anak cucu, mari kita rawat dengan cinta.",
    "Petani yang cerdas adalah petani yang mencatat setiap detail usahanya.",
    "Kemandirian pangan dimulai dari ketelitian kita dalam mengelola pengeluaran.",
    "Jangan hanya menanam benih, tapi tanamlah harapan dan ketekunan.",
    "Keuntungan sejati bukan hanya soal rupiah, tapi juga soal keberlanjutan alam.",
    "Setiap tetes keringat di ladang adalah investasi untuk masa depan yang lebih baik.",
    "Mari bertani dengan hati, mencatat dengan jari, dan menikmati dengan rendah hati.",
    "Kebersamaan dalam kelompok tani adalah kekuatan kita menghadapi tantangan zaman.",
    "Inovasi pertanian tidak harus mahal, dimulai dari keterbukaan kita terhadap ilmu baru.",
    "Tanaman yang sehat berawal dari tanah yang sehat dan pengelolaan yang tepat.",
    "Kejujuran dalam mencatat transaksi adalah cermin kejujuran kita pada diri sendiri.",
    "Jangan menyerah saat musim sulit, karena ketekunan akan membuahkan hasil yang manis.",
    "Petani adalah pahlawan tanpa tanda jasa yang memberi makan seluruh dunia.",
    "Mari kita wujudkan Thangun Afa yang mandiri dan berdaya saing tinggi.",
    "Efisiensi biaya adalah langkah awal menuju keuntungan yang lebih maksimal.",
    "Peralatan yang bersih dan terawat akan mendampingi kita lebih lama di ladang.",
    "Pupuk terbaik bagi tanah adalah langkah kaki sang pemiliknya.",
    "Bertanilah seolah-olah kamu akan hidup selamanya, beramallah seolah-olah kamu akan mati besok.",
    "Kesuksesan pertanian butuh kerjasama, bukan sekadar kompetisi.",
    "Jadilah petani yang tidak hanya ahli menanam, tapi juga cerdas berorganisasi.",
    "Setiap komoditas yang kita tanam adalah bagian dari identitas budaya kita.",
    "Keadilan dalam pembagian tugas adalah ruh dari organisasi yang sehat.",
    "Masa depan pertanian ada di tangan kita yang mau terus belajar dan beradaptasi.",
    "Jangan biarkan kesulitan hari ini menghapus semangat untuk menanam besok pagi.",
    "Transparansi keuangan kelompok adalah kunci kepercayaan antar anggota.",
    "Pertanian organik bukan sekadar teknik, tapi cara kita menghargai kehidupan.",
    "Mari jadikan setiap jengkal tanah kita sebagai sumber kehidupan yang barokah."
];

export const getQuoteOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return AGRI_QUOTES[dayOfYear % AGRI_QUOTES.length];
};
