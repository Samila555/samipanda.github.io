const { Payment } = require('../models');
const { Op } = require('sequelize');

exports.createPayment = async (req, res) => {
  try {
    const { customerName, transactionId, amount } = req.body;
    if (!customerName) return res.status(400).json({ message: 'Customer name is required' });
    if (!req.file) return res.status(400).json({ message: 'Payment screenshot is required' });
    
    const screenshot = `/uploads/${req.file.filename}`;
    const payment = await Payment.create({
      customerName,
      screenshot,
      transactionId: transactionId || '',
      amount: Number(amount) || 0,
    });
    let v = payment.toJSON(); v._id = v.id;
    res.status(201).json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};
    if (search) where.customerName = { [Op.like]: `%${search}%` };
    if (status) where.paymentStatus = status;
    
    const payments = await Payment.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(payments.map(p => {
        let v = p.toJSON(); v._id = v.id; return v;
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, note } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    await payment.update({ paymentStatus, note: note || '' });
    let v = payment.toJSON(); v._id = v.id;
    res.json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
