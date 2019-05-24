export const logger = (message: string) => {
  fetch('/api/log', {
    body: JSON.stringify({
      location: window.location.pathname,
      message: message
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'POST'
  });
};
