import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const uploadsDir = path.resolve('uploads');

function createPlaceholderFile(id: string, content: string) {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, id), content);
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  await prisma.file_Tags.deleteMany();
  await prisma.file.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'demo@datashare.com' } });

  const hashedPassword = await bcrypt.hash('demo1234', 10);

  const user = await prisma.user.create({
    data: { email: 'demo@datashare.com', password: hashedPassword },
  });

  const files: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    password?: string;
    expiration_date: Date;
    placeholder: boolean;
  }> = [
    {
      id: 'seed-file-001',
      name: 'rapport_annuel_2025.pdf',
      type: 'application/pdf',
      size: 2_450_000,
      expiration_date: daysFromNow(6),
      placeholder: true,
    },
    {
      id: 'seed-file-002',
      name: 'photo_vacances.jpg',
      type: 'image/jpeg',
      size: 3_200_000,
      expiration_date: daysFromNow(3),
      placeholder: true,
    },
    {
      id: 'seed-file-003',
      name: 'backup_config.zip',
      type: 'application/zip',
      size: 890_000,
      password: await bcrypt.hash('secret123', 10),
      expiration_date: daysFromNow(1),
      placeholder: true,
    },
    {
      id: 'seed-file-004',
      name: 'dataset_clients.csv',
      type: 'text/csv',
      size: 145_000,
      expiration_date: daysFromNow(5),
      placeholder: true,
    },
    {
      id: 'seed-file-005',
      name: 'ancien_projet.docx',
      type: 'application/msword',
      size: 560_000,
      expiration_date: daysFromNow(-2),
      placeholder: false,
    },
    {
      id: 'seed-file-006',
      name: 'logs_serveur_oct.txt',
      type: 'text/plain',
      size: 78_000,
      expiration_date: daysFromNow(-8),
      placeholder: false,
    },
    {
      id: 'seed-file-007',
      name: 'archive_mars.tar.gz',
      type: 'application/gzip',
      size: 12_300_000,
      password: await bcrypt.hash('archive42', 10),
      expiration_date: daysFromNow(-30),
      placeholder: false,
    },
  ];

  for (const f of files) {
    const { placeholder, ...data } = f;
    await prisma.file.create({ data: { ...data, user_id: user.id } });
    if (placeholder) createPlaceholderFile(f.id, `[seed placeholder: ${f.name}]`);
  }

  console.log(`✓ User created: demo@datashare.com / demo1234`);
  console.log(`✓ ${files.length} files seeded (${files.filter(f => f.placeholder).length} valide, ${files.filter(f => !f.placeholder).length} expiré)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
