import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { FilesService } from 'src/modules/files/files.service';
import * as fs from 'fs';
import * as path from 'path';

describe('DataShare Lifecycle (E2E)', () => {
  let app: INestApplication;
  let accessToken: string;
  let uploadedFileId: string;

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
  };

  // Fichier tampon pour le test d'upload
  const testFilePath = path.join(__dirname, 'test-file.txt');

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'postgres://datashare:datashare@localhost:5432/datashare';

    // Création du dossier/fichier physique de test
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
    fs.writeFileSync(testFilePath, 'contenu du fichier de test');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    // Nettoyage : suppression du fichier de test et fermeture app
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
    await app.close();
  });

  describe('Phase 1: Authentification', () => {
    it('/auth/register (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
    });

    it('/auth/register (POST) - should return 409 for duplicate email (Trigger Filter)', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('/auth/login (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(201);

      accessToken = response.body.access_token;
      expect(accessToken).toBeDefined();
    });

    it('/auth/login (POST) - should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'password' })
        .expect(401);
    });
  });

  describe('Phase 2: Cycle de vie du Fichier', () => {
    it('/files/upload (POST) - Succès', async () => {
      const response = await request(app.getHttpServer())
        .post('/files/upload')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', testFilePath) // Simule l'envoi d'un fichier multipart
        .field('expiration_date', new Date(Date.now() + 86400000).toISOString())
        .expect(201);

      uploadedFileId = response.body.id;
      expect(uploadedFileId).toBeDefined();
      expect(response.body.name).toBe('test-file.txt');
    });

    it('/files (GET) - Liste utilisateur', async () => {
      const response = await request(app.getHttpServer())
        .get('/files')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.some((f) => f.id === uploadedFileId)).toBe(true);
    });

    it('/files/:id (DELETE) - Suppression', async () => {
      await request(app.getHttpServer())
        .delete(`/files/${uploadedFileId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('/files/:id (DELETE) - should return 403 for non-existent file (Guard protection)', () => {
      return request(app.getHttpServer())
        .delete('/files/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });

    it('FilesService - should run cleanup logic', async () => {
      // On récupère l'instance du service directement depuis l'app Nest
      const filesService = app.get(FilesService);
      // On force l'exécution de la méthode de nettoyage
      await filesService.handleFileCleanup();
      expect(true).toBe(true);
    });
  });

  describe('Phase 3: Gestion du compte', () => {
    it('/users/me (GET) - Vérification profil', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.email).toBe(testUser.email);
    });

    it('/users/me (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('/users/me (DELETE) - Suppression compte', async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
