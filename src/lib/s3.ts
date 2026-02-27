import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

export function getS3Client() {
    return new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        endpoint: process.env.AWS_S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(process.env.AWS_S3_ENDPOINT),
        credentials: {
            accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
            secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY'),
        },
    });
}

export async function createPresignedUpload(input: {
    key: string;
    contentType: string;
    expiresIn?: number;
}) {
    const bucket = requiredEnv('AWS_S3_BUCKET_NAME');
    const client = getS3Client();

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: input.key,
        ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, {
        expiresIn: input.expiresIn ?? 900,
    });

    const baseUrl = process.env.AWS_S3_ENDPOINT
        ? `${process.env.AWS_S3_ENDPOINT.replace(/\/$/, '')}/${bucket}`
        : `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`;

    return {
        uploadUrl,
        fileUrl: `${baseUrl}/${input.key}`,
    };
}
