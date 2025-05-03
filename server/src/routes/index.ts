import { Router } from 'express'
import weatherRoutes from './api/weatherRoutes.js'

const router = Router()

router.use('/api/weather', weatherRoutes)

export default router
