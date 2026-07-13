import os

base_dir = r"c:\Users\HP\Desktop\Smart Manu\smart-menu\backend"

files = {
    "controllers/feedbackController.js": """const { Feedback } = require('../models');

exports.createFeedback = async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    if (!customerName || !rating) {
      return res.status(400).json({ message: 'Name and rating are required' });
    }
    const feedback = await Feedback.create({ customerName, rating, comment });
    let v = feedback.toJSON(); v._id = v.id;
    res.status(201).json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json(feedbacks.map(f => {
        let v = f.toJSON(); v._id = v.id; return v;
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    await feedback.destroy();
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToFeedback = async (req, res) => {
  try {
    const { response } = req.body;
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    await feedback.update({ response });
    let v = feedback.toJSON(); v._id = v.id;
    res.json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
""",

    "controllers/paymentController.js": """const { Payment } = require('../models');
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
""",

    "controllers/qrController.js": """const QRCode = require('qrcode');
const { QRCodeModel } = require('../models');

exports.generateQR = async (req, res) => {
  try {
    const { title } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const menuUrl = process.env.FRONTEND_URL || `${baseUrl.replace(':5000', ':3000')}`;
    const qrImage = await QRCode.toDataURL(menuUrl, { width: 600, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
    
    const qrRecord = await QRCodeModel.create({ qrImage, menuUrl, title: title || 'Menu QR Code' });
    let v = qrRecord.toJSON(); v._id = v.id;
    res.status(201).json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCodeModel.findAll({ order: [['createdAt', 'DESC']] });
    res.json(qrCodes.map(q => {
        let v = q.toJSON(); v._id = v.id; return v;
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQR = async (req, res) => {
  try {
    const qr = await QRCodeModel.findByPk(req.params.id);
    if (!qr) return res.status(404).json({ message: 'QR Code not found' });
    await qr.destroy();
    res.json({ message: 'QR Code deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path.replace("/", "\\"))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {full_path}")
