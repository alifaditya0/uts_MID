const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan daftar semua mata pelajaran
router.get('/', (req, res) => {
    connection.query('SELECT * FROM Mata_Pelajaran', (err, rows) => {
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
                message: 'Data Mata Pelajaran',
                data: rows
            });
        }
    });
});

// Mendapatkan informasi mata pelajaran berdasarkan ID
router.get('/:id', (req, res) => {
    let id = req.params.id;

    connection.query('SELECT * FROM Mata_Pelajaran WHERE ID_Mata_Pelajaran = ?', [id], (err, rows) => {
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
                message: 'Mata Pelajaran not found'
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Mata Pelajaran Details',
                data: rows[0]
            });
        }
    });
});

// Menambahkan mata pelajaran baru
router.post('/store', [
    body('Nama_Mata_Pelajaran').notEmpty(),
    // Anda dapat menambahkan validasi untuk kolom lainnya sesuai kebutuhan
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let data = {
        Nama_Mata_Pelajaran: req.body.Nama_Mata_Pelajaran,
    };

    connection.query('INSERT INTO Mata_Pelajaran SET ?', data, (err, result) => {
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
                message: 'Mata Pelajaran telah ditambahkan.',
                data: data
            });
        }
    });
});

// Mengupdate informasi mata pelajaran berdasarkan ID
router.patch('/update/:id', [
    body('Nama_Mata_Pelajaran').notEmpty(),
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
        Nama_Mata_Pelajaran: req.body.Nama_Mata_Pelajaran,
    };

    connection.query('UPDATE Mata_Pelajaran SET ? WHERE ID_Mata_Pelajaran = ?', [data, id], (err, result) => {
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
                message: 'Data Mata Pelajaran berhasil diperbarui.'
            });
        }
    });
});

// Menghapus mata pelajaran berdasarkan ID
router.delete('/delete/:id', (req, res) => {
    let id = req.params.id;
    connection.query('DELETE FROM Mata_Pelajaran WHERE ID_Mata_Pelajaran = ?', [id], (err, result) => {
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
                message: 'Mata Pelajaran telah dihapus.'
            });
        }
    });
});

module.exports = router;
