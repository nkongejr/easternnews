const asyncHandler = require('express-async-handler');
const Advertiser = require('../models/Advertiser');

const getAdvertisers = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.placement) filter.adPlacement = req.query.placement;
  if (req.query.category) filter.category = req.query.category;
  const advertisers = await Advertiser.find(filter).sort('businessName');
  res.json(advertisers);
});

const getAdvertiserBySlug = asyncHandler(async (req, res) => {
  const advertiser = await Advertiser.findOne({ slug: req.params.slug });
  if (!advertiser) { res.status(404); throw new Error('Advertiser not found'); }
  res.json(advertiser);
});

const getAdvertiserById = asyncHandler(async (req, res) => {
  const advertiser = await Advertiser.findById(req.params.id);
  if (!advertiser) { res.status(404); throw new Error('Advertiser not found'); }
  res.json(advertiser);
});


const createAdvertiser = asyncHandler(async (req, res) => {
  const advertiser = await Advertiser.create(req.body);
  res.status(201).json(advertiser);
});

const updateAdvertiser = asyncHandler(async (req, res) => {
  const advertiser = await Advertiser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!advertiser) { res.status(404); throw new Error('Advertiser not found'); }
  res.json(advertiser);
});

const deleteAdvertiser = asyncHandler(async (req, res) => {
  const advertiser = await Advertiser.findByIdAndDelete(req.params.id);
  if (!advertiser) { res.status(404); throw new Error('Advertiser not found'); }
  res.json({ message: 'Advertiser removed' });
});

module.exports = { getAdvertisers, getAdvertiserBySlug, createAdvertiser, updateAdvertiser, deleteAdvertiser,getAdvertiserById };