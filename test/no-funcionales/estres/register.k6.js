import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '10m', target: 0 },
  ],
};

export default function () {
  const email = `user-${__VU}-${__ITER}@example.com`;
  const res = http.post('http://localhost:3000/api/auth/register', JSON.stringify({
    email: email,
    password: 'password123',
  }), { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'status was 201': (r) => r.status == 201 });
  sleep(1);
}

