const alertsModel = require('../models/alerts');
exports.getAll = async (req, res) => {
    try {
        const alerts = await alertsModel.getAllAlerts();
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const alert = await alertsModel.getAlertById(req.params.id);
        if (!alert) return res.status(404).json({ error: 'Alert not found' });
        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { title, description = '', severity } = req.body;
        const newAlert = await alertsModel.createAlert(title, description, severity);

        res.status(201).json(newAlert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { title, severity } = req.body;
        const updatedAlert = await alertsModel.updateAlert(req.params.id, title, severity);
        res.json(updatedAlert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await alertsModel.deleteAlert(req.params.id);
        res.status(200).json({ message: 'Alert deleted' }); //  instead of 204
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

