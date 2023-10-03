const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua hasil ujian dengan nama siswa dan nama mata pelajaran
router.get('/', (req, res) => {
    connection.query('SELECT hu.*, s.Nama_Siswa, mp.Nama_Mata_Pelajaran FROM Hasil_Ujian hu ' +
                    'INNER JOIN Siswa s ON hu.Siswa = s.ID_Siswa ' +
                    'INNER JOIN Mata_Pelajaran mp ON hu.Mata_Pelajaran = mp.ID_Mata_Pelajaran', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Hasil Ujian dengan Nama Siswa dan Nama Mata Pelajaran',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi hasil ujian berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT hu.*, s.Nama_Siswa, mp.Nama_Mata_Pelajaran FROM Hasil_Ujian hu ' +
    'INNER JOIN Siswa s ON hu.Siswa = s.ID_Siswa ' +
    'INNER JOIN Mata_Pelajaran mp ON hu.Mata_Pelajaran = mp.ID_Mata_Pelajaran WHERE ID_Hasil_Ujian = ?', [id], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err
            });
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Hasil Ujian not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Hasil Ujian Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan hasil ujian baru
router.post('/store', [
    body('Siswa').notEmpty(),
    body('Mata_Pelajaran').notEmpty(),
    body('Nilai').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Siswa: req.body.Siswa,
        Mata_Pelajaran: req.body.Mata_Pelajaran,
        Nilai: req.body.Nilai,
    };

    connection.query('INSERT INTO Hasil_Ujian SET ?', data, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Hasil Ujian telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi hasil ujian berdasarkan ID
router.patch('/update/:id', [
    body('Siswa').notEmpty(),
    body('Mata_Pelajaran').notEmpty(),
    body('Nilai').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let id = req.params.id;
    let data = {
        Siswa: req.body.Siswa,
        Mata_Pelajaran: req.body.Mata_Pelajaran,
        Nilai: req.body.Nilai,
    };

    connection.query('UPDATE Hasil_Ujian SET ? WHERE ID_Hasil_Ujian = ?', [data, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Hasil Ujian berhasil diperbarui.'
            });
        }
    });
});

// Menghapus hasil ujian berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Hasil_Ujian WHERE ID_Hasil_Ujian = ?', [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                status: false,
                message: 'Server Error',
                error: err
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Hasil Ujian telah dihapus.'
            });
        }
    });
});

module.exports = router;
