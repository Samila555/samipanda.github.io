const QRCode = require('qrcode');
const { QRCodeModel } = require('../models');

exports.generateQR = async (req, res) => {
  try {
    const { title } = req.body;

    // Automatically detect the local IPv4 address so phones can connect if developing locally
    let hostIp = req.hostname;
    if (hostIp === 'localhost' || hostIp === '127.0.0.1') {
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
          // Skip internal and non-IPv4 addresses
          if (!iface.internal && iface.family === 'IPv4') {
            hostIp = iface.address;
            break;
          }
        }
      }
    }

    const baseUrl = `${req.protocol}://${hostIp}:5000`;
    let frontendBase = process.env.FRONTEND_URL || baseUrl.replace(':5000', ':3000');

    // Ensure frontendBase doesn't have a trailing slash
    if (frontendBase.endsWith('/')) frontendBase = frontendBase.slice(0, -1);

    // Generate menuUrl with table query parameter if title is given
    const tableParam = title ? `?table=${encodeURIComponent(title)}` : '';
    const menuUrl = `${frontendBase}/menu${tableParam}`;

    const qrImage = await QRCode.toDataURL(menuUrl, { width: 600, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });

    const qrRecord = await QRCodeModel.create({ qrImage, menuUrl, title: title || 'Main Menu' });
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
