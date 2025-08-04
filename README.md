# Grounded Communications Website

A modern, responsive website for Grounded Communications marketing agency built with HTML, CSS, and JavaScript.

## 🚀 Deployment Setup

This project is configured to deploy to AWS S3 with CloudFront CDN using GitHub Actions.

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **S3 Bucket** for hosting static files
3. **CloudFront Distribution** for CDN
4. **GitHub Repository** with secrets configured

### AWS Setup

#### 1. Create S3 Bucket

```bash
# Create bucket (replace with your bucket name)
aws s3 mb s3://your-website-bucket-name

# Enable static website hosting
aws s3 website s3://your-website-bucket-name --index-document index.html --error-document index.html
```

#### 2. Configure S3 Bucket Policy

Apply the bucket policy from `aws-s3-bucket-policy.json` (replace `YOUR-BUCKET-NAME` with your actual bucket name).

#### 3. Create CloudFront Distribution

Use the configuration in `aws-cloudfront-distribution.json` as a template, updating the bucket name.

### GitHub Secrets Setup

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `S3_BUCKET` - Your S3 bucket name (e.g., `your-website-bucket-name`)
- `CLOUDFRONT_DISTRIBUTION_ID` - Your CloudFront distribution ID

### IAM User Permissions

Create an IAM user with these permissions:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:GetObject",
				"s3:PutObject",
				"s3:DeleteObject",
				"s3:ListBucket"
			],
			"Resource": [
				"arn:aws:s3:::YOUR-BUCKET-NAME",
				"arn:aws:s3:::YOUR-BUCKET-NAME/*"
			]
		},
		{
			"Effect": "Allow",
			"Action": [
				"cloudfront:CreateInvalidation",
				"cloudfront:GetInvalidation",
				"cloudfront:ListInvalidations"
			],
			"Resource": "arn:aws:cloudfront::*:distribution/*"
		}
	]
}
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
grounded/
├── .github/workflows/     # GitHub Actions
├── css/                   # Stylesheets
├── js/                    # JavaScript modules
├── img/                   # Images and assets
├── index.html            # Homepage
├── about.html            # About page
├── services.html         # Services page
├── contact.html          # Contact page
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite for building. Configuration is in `vite.config.js`.

### Build Output

The build process creates a `dist/` folder containing the optimized static files ready for deployment.

## 🌐 Deployment

The site automatically deploys when you push to the `main` branch. The deployment process:

1. Builds the project using Vite
2. Syncs files to S3 bucket
3. Invalidates CloudFront cache
4. Updates are live within minutes

## 📝 Notes

- The site uses clean URLs (no .html extensions)
- CloudFront handles 404 redirects to index.html for SPA-like behavior
- All assets are optimized during build
- Cache invalidation ensures immediate updates

## 🆘 Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version and dependencies
2. **Deployment fails**: Verify AWS credentials and permissions
3. **Cache issues**: CloudFront invalidation may take 5-10 minutes
4. **404 errors**: Ensure S3 bucket is configured for static website hosting

### Debugging

- Check GitHub Actions logs for build errors
- Verify S3 bucket permissions
- Confirm CloudFront distribution is properly configured
- Test local build with `npm run build`
