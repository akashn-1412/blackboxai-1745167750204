# Camera Quality Photo Sharing Web Application

## Project Overview
This project is a responsive web application that allows users to upload photos taken by their smartphone cameras, tagged with the phone's brand and model, to help others evaluate camera quality. The platform includes user authentication, photo upload with metadata, search and filter capabilities, photo details with comments and ratings, a comparison tool, and basic moderation.

## Tech Stack
- Frontend: React with Tailwind CSS
- Backend: Node.js with Express
- Database: MongoDB
- Storage: AWS S3 for photo storage
- Authentication: Email/password and OAuth (Google)
- Image Processing: Compression to WebP, EXIF data extraction and stripping

## Features
1. User Authentication (email and OAuth)
2. Photo Upload with phone brand/model tagging and EXIF verification
3. Search and filter photos by brand, model, and photo type
4. Photo details page with metadata, comments, and ratings
5. Comparison tool for side-by-side photo viewing
6. Basic content moderation and spam prevention
7. Privacy and legal compliance (GDPR/CCPA)

## Development Plan
- Setup backend with Express, MongoDB, and AWS S3 integration
- Implement authentication routes and middleware
- Create photo upload API with EXIF extraction and image compression
- Develop search and filter endpoints
- Build frontend React app with pages for login, upload, gallery, photo details, and comparison
- Style UI with Tailwind CSS for responsiveness and modern look
- Implement moderation features and privacy compliance
- Test and deploy

## Next Steps
- Initialize backend and frontend projects
- Setup environment variables and AWS credentials
- Begin backend API development
