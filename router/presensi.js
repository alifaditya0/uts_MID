const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua presensi dengan nama kelas dan nama siswa
router.get('/', (req, res) => {
    connection.query('SELECT p.*, k.Nama_Kelas, s.Nama_Siswa FROM Presensi p ' +
                    'INNER JOIN Kelas k ON p.Kelas = k.ID_Kelas ' +
                    'INNER JOIN Siswa s ON p.Siswa = s.ID_Siswa', (err, rows) => {
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
                message: 'Data Presensi dengan Nama Kelas dan Nama Siswa',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi presensi berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT p.*, k.Nama_Kelas, s.Nama_Siswa FROM Presensi p ' +
                    'INNER JOIN Kelas k ON p.Kelas = k.ID_Kelas ' +
                    'INNER JOIN Siswa s ON p.Siswa = s.ID_Siswa WHERE ID_Presensi = ?', [id], (err, rows) => {
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
                message: 'Presensi not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Presensi Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan presensi baru
router.post('/store', [
    body('Tanggal').notEmpty(),
    body('Kelas').notEmpty(),
    body('Siswa').notEmpty(),
    body('Kehadiran').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Tanggal: req.body.Tanggal,
        Kelas: req.body.Kelas,
        Siswa: req.body.Siswa,
        Kehadiran: req.body.Kehadiran,
    };

    connection.query('INSERT INTO Presensi SET ?', data, (err, result) => {
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
                message: 'Presensi telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi presensi berdasarkan ID
router.patch('/update/:id', [
    body('Tanggal').notEmpty(),
    body('Kelas').notEmpty(),
    body('Siswa').notEmpty(),
    body('Kehadiran').notEmpty(),
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
        Tanggal: req.body.Tanggal,
        Kelas: req.body.Kelas,
        Siswa: req.body.Siswa,
        Kehadiran: req.body.Kehadiran,
    };

    connection.query('UPDATE Presensi SET ? WHERE ID_Presensi = ?', [data, id], (err, result) => {
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
                message: 'Data Presensi berhasil diperbarui.'
            });
        }
    });
});

// Menghapus presensi berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Presensi WHERE ID_Presensi = ?', [id], (err, result) => {
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
                message: 'Presensi telah dihapus.'
            });
        }
    });
});

module.exports = router;
