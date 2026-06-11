export default function handler(req, res) {
  res.status(200).json({ ping: true, time: Date.now() });
}