import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 100},
    { duration: '30s', target: 500},
    { duration: '45s', target: 500},
    { duration: '1m', target: 1000},
    { duration: '30s', target: 0},
  ]

}

export default function() {
  const randonNum = Math.floor(Math.random() * 1000);

  const urls = [
    `http://localhost:3000/qa/questions/${randonNum}/answers`,
    `http://localhost:3000/qa/questions/${randonNum}`
  ];

  for (let url of urls) {
    const res = http.get(url);
    sleep(1);
    check(res, {
      'is status 200': r => r.status === 200,
      'transaction time < 200 ms': r => r.timings.duration < 200,
      'transaction time < 500 ms': r => r.timings.duration < 500,
      'transaction time < 1000 ms': r => r.timings.duration < 1000,
      'transaction time < 2000 ms': r => r.timings.duration < 2000,
      'transaction time > 2000 ms': r => r.timings.duration > 2000,
    })
  }
}