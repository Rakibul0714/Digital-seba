import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const services = [
  'নাগরিক সনদের আবেদন','ওয়ারিশ সনদের আবেদন','চারিত্রিক সনদের আবেদন','মৃত্যু সনদের আবেদন',
  'পুনঃ বিবাহ না হওয়ার সনদের আবেদন','প্রতিবন্ধী সনদের আবেদন','বিদ্যুৎ নেওয়ার প্রত্যয়নপত্র',
  'ভোটার এলাকা স্থানান্তর অনাপত্তি','অভিভাবক আয়ের আবেদন','মুক্তিযোদ্ধা আবেদন',
  'মুক্তিযোদ্ধা সন্তানের আবেদন','একই নামীয় আবেদন','ক্ষুদ্র নৃগোষ্ঠী আবেদন',
  'পেশা সংক্রান্ত আবেদন','উত্তরাধিকারী সনদপত্র আবেদন','অবিবাহিত সনদপত্র আবেদন',
  'প্রত্যয়নপত্র আবেদন','ভূমিহীন সনদপত্র আবেদন','জাতীয় পরিচয়পত্র সংশোধন',
  'নতুন ভোটার হবার সনদপত্র','নিঃসন্তান সনদপত্র আবেদন','বিদ্যুৎ সংযোগ না থাকার আবেদন',
  'চর এলাকায় বিদ্যুৎ না থাকার আবেদন','ট্রেড লাইসেন্স আবেদন',
];

async function main() {
  const haripur = await prisma.union.upsert({
    where: { code: 'HARI' },
    update: {},
    create: { nameBn: '০৪ নং হরিপুর ইউনিয়ন', code: 'HARI' },
  });

  const rani = await prisma.union.upsert({
    where: { code: 'RANI' },
    update: {},
    create: { nameBn: '০১ নং রানী ইউনিয়ন', code: 'RANI' },
  });

  for (const [i, nameBn] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: `service-${i + 1}` },
      update: { nameBn },
      create: {
        slug: `service-${i + 1}`,
        nameBn,
        fee: i === 23 ? 500 : 50,
        formSchema: { type: i === 1 ? 'warish' : 'basic' },
      },
    });
  }

  const passwordHash = crypto.createHash('sha256').update('Admin@123').digest('hex');
  await prisma.user.upsert({
    where: { email: 'office@digitalseba.local' },
    update: {},
    create: {
      email: 'office@digitalseba.local',
      passwordHash,
      role: 'UNION_ADMIN',
      unionId: haripur.id,
    },
  });

  await prisma.notice.create({
    data: {
      titleBn: 'স্মার্ট সেবা প্ল্যাটফর্মে স্বাগতম',
      bodyBn: 'নাগরিক সেবা এখন আরও সহজ ও দ্রুত।',
    },
  });

  console.log(`Seeded: 2 unions, ${services.length} services, 1 admin user, 1 notice`);
}

main().finally(() => prisma.$disconnect());
