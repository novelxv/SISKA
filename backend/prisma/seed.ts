import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('akademik123', 10);

    await prisma.user.create({
        data: {
            username: 'akademik',
            password: hashedPassword,
            role: 'AKADEMIK',
        },
    });
    console.log('User created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });