const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua siswa
router.get('/', (req, res) => {
    connection.query('SELECT * FROM Siswa', (err, rows) => {
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
                message: 'Data Siswa',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi siswa berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT * FROM Siswa WHERE ID_Siswa = ?', [id], (err, rows) => {
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
                message: 'Siswa not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Siswa Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan siswa baru
router.post('/store', [
    body('Nama_Siswa').notEmpty(),
    body('Kelas').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Nama_Siswa: req.body.Nama_Siswa,
        Kelas: req.body.Kelas,
        Alamat: req.body.Alamat,
        Nomor_Telepon: req.body.Nomor_Telepon,
    };

    connection.query('INSERT INTO Siswa SET ?', data, (err, result) => {
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
                message: 'Siswa telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi siswa berdasarkan ID
router.patch('/update/:id', [
    body('Nama_Siswa').notEmpty(),
    body('Kelas').notEmpty(),
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
        Nama_Siswa: req.body.Nama_Siswa,
        Kelas: req.body.Kelas,
        Alamat: req.body.Alamat,
        Nomor_Telepon: req.body.Nomor_Telepon,
    };

    connection.query('UPDATE Siswa SET ? WHERE ID_Siswa = ?', [data, id], (err, result) => {
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
                message: 'Data Siswa berhasil diperbarui.'
            });
        }
    });
});

// Menghapus siswa berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Siswa WHERE ID_Siswa = ?', [id], (err, result) => {
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
                message: 'Siswa telah dihapus.'
            });
        }
    });
});

module.exports = router;
