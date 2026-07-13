const { Feedback } = require('../models');

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
