# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Public feed and post pages; writing stays behind login
- Demo seed script with two local accounts and four posts
- API base URL read from `REACT_APP_API_URL`

### Fixed
- Session no longer logs the user out on refresh

### Changed
- Frontend directory renamed from `project1` to `frontend`

### Security
- JWT token authentication
- Password hashing with bcrypt
- CORS configuration

## [1.0.0] - 2025-01-XX

### Added
- Full-stack blog application
- React frontend with modern UI
- Node.js/Express backend API
- PostgreSQL database
- User registration and login
- Blog post creation, editing, and deletion
- Draft and published post system
- Responsive design for mobile and desktop
- JWT-based authentication
- Protected routes
- User profile management
- Dark UI

### Security
- Secure password hashing
- JWT token validation
- CORS protection
- Input validation and sanitization

---

## Version History

- **1.0.0** - Initial release with core blog functionality 