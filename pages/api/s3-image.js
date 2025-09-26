import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3_ENDPOINT = process.env.NEXT_PUBLIC_S3_ENDPOINT;
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION;
const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;
const S3_ACCESS_KEY = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID;
const S3_SECRET_KEY = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY;

if (!S3_ENDPOINT || !S3_REGION || !S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
  console.warn('S3 image config missing. Check NEXT_PUBLIC_S3_* env vars.');
}

const s3Client = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: S3_ACCESS_KEY && S3_SECRET_KEY ? {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  } : undefined,
  forcePathStyle: true,
});

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: 'Missing key parameter' });
  }
  // Normalize key: some callers may pass a full URL or a path prefixed with the bucket.
  // We only want the object key relative to the bucket when calling GetObject.
  let objectKey = String(key);
  try {
    objectKey = decodeURIComponent(objectKey);
  } catch (e) {
    // ignore decode errors and use raw value
  }
  // If a full URL was passed (e.g. https://domain/.../bucket/name.jpg), strip scheme+host.
  objectKey = objectKey.replace(/^https?:\/\/[^/]+\//i, '');
  // Remove any querystring or fragment (anything after ? or #)
  objectKey = objectKey.split(/[?#]/, 1)[0];
  // Trim any leading slashes
  objectKey = objectKey.replace(/^\/+/, '');
  // If the bucket name is included in the path (e.g. 'sf-forums/xxx'), remove the bucket prefix.
  if (objectKey.startsWith(`${S3_BUCKET}/`)) {
    objectKey = objectKey.substring(S3_BUCKET.length + 1);
  }
  // Validate S3 configuration before attempting to use AWS SDK.
  const missing = [];
  if (!S3_ENDPOINT) missing.push('NEXT_PUBLIC_S3_ENDPOINT');
  if (!S3_BUCKET) missing.push('NEXT_PUBLIC_S3_BUCKET');
  if (!S3_ACCESS_KEY) missing.push('NEXT_PUBLIC_S3_ACCESS_KEY_ID');
  if (!S3_SECRET_KEY) missing.push('NEXT_PUBLIC_S3_SECRET_ACCESS_KEY');
  if (missing.length) {
    console.error('S3 config missing:', missing.join(', '));
    return res.status(500).json({ error: `S3 configuration missing: ${missing.join(', ')}` });
  }
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: objectKey,
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    // If the caller requests a redirect, send a 302 to the signed URL.
    const redirect = String(req.query.redirect || '').toLowerCase();
    if (redirect === '1' || redirect === 'true') {
      res.setHeader('Location', url);
      return res.status(302).end();
    }
    res.status(200).json({ url });
  } catch (err) {
    console.error('S3 signed URL error:', err);
    res.status(500).json({ error: err.message });
  }
}
