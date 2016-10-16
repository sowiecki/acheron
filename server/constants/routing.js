export const AUTHORIZED_HEADERS = [
  'event',
  'id',
  'payload',
  'Content-Type',
  'Authorization',
  'Content-Length',
  'X-Requested-With',
  'Origin',
  'Accept'
].join(', ');

export const AUTHORIZED_METHODS = [
  'GET',
  'PUT',
  'POST',
  'DELETE',
  'OPTIONS'
].join(', ');
