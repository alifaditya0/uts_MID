const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua kelas
router.get('/', (req, res) => {
    connection.query('SELECT * FROM Kelas', (err, rows) => {
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
                message: 'Data Kelas',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi kelas berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT * FROM Kelas WHERE ID_Kelas = ?', [id], (err, rows) => {
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
                message: 'Kelas not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Kelas Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan kelas baru
router.post('/store', [
    body('Nama_Kelas').notEmpty(),
    body('Tingkat').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Nama_Kelas: req.body.Nama_Kelas,
        Tingkat: req.body.Tingkat,
    };

    connection.query('INSERT INTO Kelas SET ?', data, (err, result) => {
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
                message: 'Kelas telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi kelas berdasarkan ID
router.patch('/update/:id', [
    body('Nama_Kelas').notEmpty(),
    body('Tingkat').notEmpty(),
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
        Nama_Kelas: req.body.Nama_Kelas,
        Tingkat: req.body.Tingkat,
    };

    connection.query('UPDATE Kelas SET ? WHERE ID_Kelas = ?', [data, id], (err, result) => {
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
                message: 'Data Kelas berhasil diperbarui.'
            });
        }
    });
});

// Menghapus kelas berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Kelas WHERE ID_Kelas = ?', [id], (err, result) => {
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
                message: 'Kelas telah dihapus.'
            });
        }
    });
});

module.exports = router;
