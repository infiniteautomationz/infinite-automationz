import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@infiniteautomationz.com' },
        update: {},
        create: {
            email: 'admin@infiniteautomationz.com',
            passwordHash: adminPassword,
            role: 'ADMIN',
            displayName: 'System Admin',
        },
    })
    console.log(`Created Admin: ${admin.email}`)

    // 2. Create Demo Client & Workspace
    const clientPassword = await bcrypt.hash('client123', 10)
    const demoClient = await prisma.user.upsert({
        where: { email: 'demo@client.com' },
        update: {},
        create: {
            email: 'demo@client.com',
            passwordHash: clientPassword,
            role: 'CLIENT',
            displayName: 'Demo Business',
        },
    })

    const workspace = await prisma.workspace.upsert({
        where: { userId: demoClient.id },
        update: {
            name: 'Demo Business Apps',
            stripeCustomerId: 'cus_demo123',
            stripeSubscriptionId: 'sub_demo123',
            stripeSubscriptionStatus: 'active',
            stripePriceId: 'bundle_social_growth',
            billingLockReason: null,
            lockedAt: null,
            stripeCanceledAt: null,
        },
        create: {
            name: 'Demo Business Apps',
            userId: demoClient.id,
            stripeCustomerId: 'cus_demo123',
            stripeSubscriptionId: 'sub_demo123',
            stripeSubscriptionStatus: 'active',
            stripePriceId: 'bundle_social_growth',
        },
    })

    console.log(`Created Demo Client Workspace: ${workspace.name}`)

    // 3. Provision Service Modules
    for (const moduleType of ['SOCIAL', 'AVATAR']) {
        const exists = await prisma.serviceInstance.findFirst({
            where: { workspaceId: workspace.id, moduleType },
        });
        if (!exists) {
            await prisma.serviceInstance.create({
                data: {
                    workspaceId: workspace.id,
                    moduleType,
                    configJson: '[]',
                },
            });
        }
    }

    // 4. Create WorkItems
    await prisma.workItem.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'demo_item_1',
                workspaceId: workspace.id,
                type: 'social_post',
                status: 'Needs Review',
                title: 'Welcome Campaign - Post 1',
                description: 'Initial launch post for Facebook and Instagram. Please review the attached copy.',
                dueDate: new Date(Date.now() + 86400000 * 2),
            },
            {
                id: 'demo_item_2',
                workspaceId: workspace.id,
                type: 'social_post',
                status: 'Draft',
                title: 'Welcome Campaign - Post 2',
                description: 'Follow-up educational carousel.',
                dueDate: new Date(Date.now() + 86400000 * 4),
            },
            {
                id: 'demo_ticket_1',
                workspaceId: workspace.id,
                type: 'support_ticket',
                status: 'In Progress',
                title: 'Need help with brand asset dimensions',
                description: 'Please confirm ideal dimensions for reels and story graphics.',
            },
        ],
    });
    console.log('Created Demo Work Items');

    const thread = await prisma.messageThread.upsert({
        where: { id: 'demo_thread_1' },
        update: {},
        create: {
            id: 'demo_thread_1',
            workspaceId: workspace.id,
            title: 'Workspace Updates',
            createdById: admin.id,
        },
    });

    await prisma.message.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'demo_msg_1',
                threadId: thread.id,
                authorId: admin.id,
                content: 'Welcome aboard. Your first social campaign is pending review.',
            },
            {
                id: 'demo_msg_2',
                threadId: thread.id,
                authorId: demoClient.id,
                content: 'Looks great so far. I will review by end of day.',
            },
        ],
    });

    await prisma.calendarEvent.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'demo_event_1',
                workspaceId: workspace.id,
                title: 'Campaign review deadline',
                startsAt: new Date(Date.now() + 86400000 * 2),
                sourceType: 'due_date',
            },
        ],
    });

    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
