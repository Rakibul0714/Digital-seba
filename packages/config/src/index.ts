export const APP_CONFIG = {
  name: 'ডিজিটাল সেবা',
  description: 'ইউনিয়ন পরিষদ ডিজিটাল সেবা প্ল্যাটফর্ম',
  version: '1.0.0',
  union: {
    name: '০৪ নং হরিপুর ইউনিয়ন',
    code: 'HARI',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
} as const;
