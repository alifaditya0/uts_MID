const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua jadwal pelajaran dengan nama kelas, nama mata pelajaran, dan nama guru
router.get('/', (req, res) => {
    connection.query('SELECT jp.*, k.Nama_Kelas, mp.Nama_Mata_Pelajaran, g.Nama_Guru FROM Jadwal_Pelajaran jp ' +
                    'INNER JOIN Kelas k ON jp.Kelas = k.ID_Kelas ' +
                    'INNER JOIN Mata_Pelajaran mp ON jp.Mata_Pelajaran = mp.ID_Mata_Pelajaran ' +
                    'INNER JOIN Guru g ON jp.Guru = g.ID_Guru', (err, rows) => {
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
                message: 'Data Jadwal Pelajaran dengan Nama Kelas, Nama Mata Pelajaran, dan Nama Guru',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi jadwal pelajaran berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT jp.*, k.Nama_Kelas, mp.Nama_Mata_Pelajaran, g.Nama_Guru FROM Jadwal_Pelajaran jp ' +
    'INNER JOIN Kelas k ON jp.Kelas = k.ID_Kelas ' +
    'INNER JOIN Mata_Pelajaran mp ON jp.Mata_Pelajaran = mp.ID_Mata_Pelajaran ' +
    'INNER JOIN Guru g ON jp.Guru = g.ID_Guru WHERE ID_Jadwal = ?', [id], (err, rows) => {
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
                message: 'Jadwal Pelajaran not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Jadwal Pelajaran Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan jadwal pelajaran baru
router.post('/store', [
    body('Hari').notEmpty(),
    body('Waktu').notEmpty(),
    body('Kelas').notEmpty(),
    body('Mata_Pelajaran').notEmpty(),
    body('Guru').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Hari: req.body.Hari,
        Waktu: req.body.Waktu,
        Kelas: req.body.Kelas,
        Mata_Pelajaran: req.body.Mata_Pelajaran,
        Guru: req.body.Guru,
    };

    connection.query('INSERT INTO Jadwal_Pelajaran SET ?', data, (err, result) => {
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
                message: 'Jadwal Pelajaran telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi jadwal pelajaran berdasarkan ID
router.patch('/update/:id', [
    body('Hari').notEmpty(),
    body('Waktu').notEmpty(),
    body('Kelas').notEmpty(),
    body('Mata_Pelajaran').notEmpty(),
    body('Guru').notEmpty(),
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
        Hari: req.body.Hari,
        Waktu: req.body.Waktu,
        Kelas: req.body.Kelas,
        Mata_Pelajaran: req.body.Mata_Pelajaran,
        Guru: req.body.Guru,
    };

    connection.query('UPDATE Jadwal_Pelajaran SET ? WHERE ID_Jadwal = ?', [data, id], (err, result) => {
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
                message: 'Data Jadwal Pelajaran berhasil diperbarui.'
            });
        }
    });
});

// Menghapus jadwal pelajaran berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Jadwal_Pelajaran WHERE ID_Jadwal = ?', [id], (err, result) => {
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
                message: 'Jadwal Pelajaran telah dihapus.'
            });
        }
    });
});

module.exports = router;
