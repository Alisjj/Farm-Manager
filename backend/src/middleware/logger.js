import onFinished from "on-finished";

function now() {
  return new Date().toISOString();
}

export default function requestLogger(req, res, next) {
  const start = process.hrtime();
  const { method, originalUrl } = req;

  // Log request start
  console.log(`[${now()}] --> ${method} ${originalUrl}`);

  // Log body for POST/PUT (avoid logging sensitive fields)
  if (method === "POST" || method === "PUT") {
    try {
      console.log(`[${now()}]     body:`, JSON.stringify(req.body));
    } catch (e) {
      console.log(`[${now()}]     body: <unserializable>`);
    }
  }

  onFinished(res, () => {
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(1);
    console.log(
      `[${now()}] <-- ${method} ${originalUrl} ${res.statusCode} - ${ms}ms`
    );
  });

  next();
}
