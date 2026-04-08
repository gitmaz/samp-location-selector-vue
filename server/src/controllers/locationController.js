import { body, validationResult } from 'express-validator';
import * as LocationModel from '../models/LocationModel.js';
import { reverseGeocode } from '../services/geocodeService.js';

export const validateCreateLocation = [
  body('latitude').isFloat({ min: -90, max: 90 }).toFloat(),
  body('longitude').isFloat({ min: -180, max: 180 }).toFloat(),
  body('address').optional().isString().trim().notEmpty(),
];

export async function createLocation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { latitude, longitude, address: bodyAddress } = req.body;
  let address = bodyAddress;

  if (!address) {
    try {
      address = await reverseGeocode(latitude, longitude);
    } catch (err) {
      // If geocoding fails (network, rate-limit, policy), still store coordinates.
      address = `${latitude}, ${longitude}`;
    }
  }

  const row = LocationModel.createLocation({
    address,
    latitude,
    longitude,
  });

  res.status(201).json(row);
}

export function listLocations(req, res) {
  const rows = LocationModel.findAllOrderedByNewest();
  res.json(rows);
}

export function deleteLocation(req, res) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  const ok = LocationModel.deleteById(id);
  if (!ok) {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.status(204).send();
}
