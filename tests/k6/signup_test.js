//chạy xong kết luạn cùi như mía =))))
//    checks_total.......................: 1000   10.319792/s
//    checks_succeeded...................: 92.60% 926 out of 1000
//    checks_failed......................: 7.40%  74 out of 1000

// sau khi update thêm indexes + redis

import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";

export const options = {
  vus: 100, // số lượng "user ảo" chạy cùng lúc
  iterations: 1000, // tổng số lần chạy
};

function randomString(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function () {
  const payload = JSON.stringify({
    username: `user_${randomString(8)}`,
    password: `password123`,
    fullName: `Full Name ${randomString(5)}`,
    email: `user_${randomString(5)}@example.com`,
    gender: "MALE",
    phoneNumber: `0${Math.floor(Math.random() * 900000000 + 100000000)}`,
    major: "Logistics",
    role: "STUDENT",
    term: 1,
    skills: ["None"],
    hobbies: ["None"],
    projects: ["None"],
    profilePicture: "http://localhost:8080/imagedefault.jpg",
  });

  const headers = { "Content-Type": "application/json" };

  const res = http.post("http://localhost:8080/api/auth/signup", payload, {
    headers,
  });

  check(res, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.1); // nghỉ 100ms giữa các lần gửi
}
