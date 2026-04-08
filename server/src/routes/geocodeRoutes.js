import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { reverseGeocode } from '../services/geocodeService.js';

const router = Router();

router.get(
  '/reverse',
  [
    query('lat').isFloat({ min: -90, max: 90 }).toFloat(),
    query('lon').isFloat({ min: -180, max: 180 }).toFloat(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lat, lon } = req.query;
    const address = await reverseGeocode(Number(lat), Number(lon));
    res.json({ address });
  })
);

export default router;

