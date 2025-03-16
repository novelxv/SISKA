import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/prisma";
import bcrypt from "bcryptjs";

let akademikToken: string;
let adminKKToken: string;

beforeAll(async () => {
    await prisma.user.deleteMany();
    
    // make acc for AKADEMIK
    const hashedPasswordAkademik = await bcrypt.hash("akademik123", 10);
    await prisma.user.create({
        data: {
            username: "akademik",
            password: hashedPasswordAkademik,
            role: "AKADEMIK",
        },
    });
    
    // login as AKADEMIK
    const akademikLogin = await request(app)
    .post("/api/auth/login")
    .send({ username: "akademik", password: "akademik123" });
    akademikToken = akademikLogin.body.token;
    
    // make acc for ADMIN_KK as AKADEMIK
    const hashedPasswordAdminKK = await bcrypt.hash("adminkk123", 10);
    await prisma.user.create({
        data: {
            username: "admin_kk",
            password: hashedPasswordAdminKK,
            role: "ADMIN_KK",
        },
    });
    
    // login as ADMIN_KK
    const adminKKLogin = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin_kk", password: "adminkk123" });
    adminKKToken = adminKKLogin.body.token;
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe("Authentication API", () => {
    
    // Register Test
    describe("POST /api/auth/register", () => {
        it("should allow AKADEMIK to register a new ADMIN_KK", async () => {
            const response = await request(app)
            .post("/api/auth/register")
            .set("Authorization", `Bearer ${akademikToken}`)
            .send({
                username: "admin_kk_1",
                password: "securepassword",
                role: "ADMIN_KK",
            });
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "User registered successfully");
        });
        
        it("should NOT allow ADMIN_KK to register another user", async () => {
            const response = await request(app)
            .post("/api/auth/register")
            .set("Authorization", `Bearer ${adminKKToken}`)
            .send({
                username: "admin_kk_2",
                password: "securepassword",
                role: "ADMIN_PRODI",
            });
            
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("error", "Forbidden: Only AKADEMIK can perform this action");
        });
        
        it("should fail when registering without a token", async () => {
            const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "admin_kk_3",
                password: "securepassword",
                role: "ADMIN_KK",
            });
            
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("error", "Unauthorized: Token missing");
        });
        
        it("should fail when registering with an invalid role", async () => {
            const response = await request(app)
            .post("/api/auth/register")
            .set("Authorization", `Bearer ${akademikToken}`)
            .send({
                username: "invaliduser",
                password: "securepassword",
                role: "INVALID_ROLE",
            });
            
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe("Invalid value");
        });
        
        it("should fail when registering without required fields", async () => {
            const response = await request(app)
            .post("/api/auth/register")
            .set("Authorization", `Bearer ${akademikToken}`)
            .send({});
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("errors");
        });
    });
    
    // Login Test
    describe("POST /api/auth/login", () => {
        it("should login successfully with correct credentials", async () => {
            const response = await request(app)
            .post("/api/auth/login")
            .send({ username: "akademik", password: "akademik123" });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
        });
        
        it("should fail login with incorrect password", async () => {
            const response = await request(app)
            .post("/api/auth/login")
            .send({ username: "akademik", password: "wrongpassword" });
            
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("error", "Invalid credentials");
        });
        
        it("should fail login with non-existing user", async () => {
            const response = await request(app)
            .post("/api/auth/login")
            .send({ username: "nonexistent", password: "password123" });
            
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("error", "Invalid credentials");
        });
    });
});