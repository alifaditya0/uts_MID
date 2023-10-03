const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Import router modules for different entities
const siswaRoutes = require('./router/siswa');
const guruRoutes = require('./router/guru');
const kelasRoutes = require('./router/kelas');
const mataPelajaranRoutes = require('./router/mata_pelajaran');
const jadwalPelajaranRoutes = require('./router/jadwal_pelajaran');
const presensiRoutes = require('./router/presensi');
const hasilUjianRoutes = require('./router/hasil_ujian');

// Define routes for each entity
app.use('/api/siswa', siswaRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/kelas', kelasRoutes);
app.use('/api/mata_pelajaran', mataPelajaranRoutes);
app.use('/api/jadwal_pelajaran', jadwalPelajaranRoutes);
app.use('/api/presensi', presensiRoutes);
app.use('/api/hasil_ujian', hasilUjianRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
