export const getResponseSetter = (headers, res) => (connections) => {
  if (connections.length > 0) {
    res.json({ status: 200, message: `Forwarding ${headers.event}.` });
  } else {
    res.json({ status: 404, message: `No connected clients to handle ${headers.event}.` });
  }
};
