import { Router, Request, Response } from 'express'
import historyService from '../../service/historyService.js'
import weatherService from '../../service/weatherService.js'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body as { city?: string }
  if (!city) {
    res.status(400).json({ error: 'City name is required' })
    return
  }

  try {
    const weather = await weatherService.getWeatherForCity(city)
    await historyService.addCity(city)
    res.status(200).json(weather)
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    if (message.includes('401')) {
      res.status(401).json({ error: message })
    } else {
      res.status(500).json({ error: message })
    }
  }
})

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await historyService.getCities()
    res.status(200).json(cities)
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ error: message })
  }
})

router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await historyService.removeCity(id)
    res.sendStatus(204)
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ error: message })
  }
})

export default router
