import { PrismaService } from "src/common/prisma.service";

const prisma = new PrismaService()

export async function getUserId() {
    const userId = await prisma.user.findUnique({
        where: {
            email: 'test3@example.com'
        }
    }); 

    if(userId !== null)  {
        return userId.id
    }
}

export async function createSinglePostForUpdate(authorId: string) {
    const post = await prisma.post.create({
        data: {
            title: 'Test title for update test',
            content: 'Test content for update test',
            excerpt: 'Test excerpt for update test',
            authorId,
            slug: 'test-title-for-update-test'
        }
    });

    return post;
}

export async function createSinglePost(authorId: string) {
    const post = await prisma.post.create({
        data: {
            title: 'Test title for single slug test',
            content: 'Test content for single slug test',
            excerpt: 'Test excerpt for single slug test',
            authorId,
            slug: 'test-title-for-single-slug-test'
        }
    });

    return post;
}

export async function createManyPosts(authorId: string) { 

    const createdPosts = await prisma.post.createMany({
        data: [
            { 
                title: 'Test title',
                content: 'Test content',
                excerpt: 'Test excerpt',
                authorId,
                slug: 'test-title'
            },
            { 
                title: 'Test title 2',
                content: 'Test content',
                excerpt: 'Test excerpt',
                authorId,
                slug: 'test-title-2'
            },
            { 
                title: 'Test title 3',
                content: 'Test content',
                excerpt: 'Test excerpt',
                authorId,
                slug: 'test-title-3'
            },
        ] 
    });

    return createdPosts
    
}