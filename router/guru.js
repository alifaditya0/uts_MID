const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua guru
router.get('/', (req, res) => {
    connection.query('SELECT * FROM Guru', (err, rows) => {
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
                message: 'Data Guru',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi guru berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT * FROM Guru WHERE ID_Guru = ?', [id], (err, rows) => {
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
                message: 'Guru not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Guru Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan guru baru
router.post('/store', [
    body('Nama_Guru').notEmpty(),
    body('Mata_Pelajaran').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Nama_Guru: req.body.Nama_Guru,
        Mata_Pelajaran: req.body.Mata_Pelajaran,
        Nomor_Telepon: req.body.Nomor_Telepon,
    };

    connection.query('INSERT INTO Guru SET ?', data, (err, result) => {
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
                message: 'Guru telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi guru berdasarkan ID
router.patch('/update/:id', [
    body('Nama_Guru').notEmpty(),
    body('Mata_Pelajaran').notEmpty(),
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
        Nama_Guru: req.body.Nama_Guru,
        Mata_Pelajaran: req.body.Mata_Pelajaran,
        Nomor_Telepon: req.body.Nomor_Telepon,
    };

    connection.query('UPDATE Guru SET ? WHERE ID_Guru = ?', [data, id], (err, result) => {
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
                message: 'Data Guru berhasil diperbarui.'
            });
        }
    });
});

// Menghapus guru berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Guru WHERE ID_Guru = ?', [id], (err, result) => {
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
                message: 'Guru telah dihapus.'
            });
        }
    });
});

module.exports = router;
