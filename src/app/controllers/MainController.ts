import { Request, Response } from 'express';

class MainController {
  async index(req: Request, res: Response) {
    res.status(200).json({ api: 'Emobi Reports 0.0.1' });
    return
  }

  async health(req: Request, res: Response) {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    return
  }
}

export default new MainController();