# Contributing to Dicey

Thank you for your interest in contributing to Dicey! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Expo CLI (for mobile development)
- Expo Go app (for testing on mobile devices)

### Setting up the Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dicey.git
   cd dicey
   ```

3. **Set up the web app**:
   ```bash
   cd web
   npm install
   npm start
   ```

4. **Set up the mobile app**:
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   npm start
   ```

## 🏗️ Project Structure

```
dicey/
├── shared/           # Original shared code (reference)
├── web/              # React web application
│   ├── src/shared/   # Web app copy of shared code
│   ├── src/components/
│   └── src/services/
└── mobile/           # React Native/Expo mobile app
    ├── shared/       # Mobile app copy of shared code
    ├── components/
    └── services/
```

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting and style
- Use functional components and React hooks
- Keep components small and focused
- Add type definitions for all props and functions

### Shared Code
- Both web and mobile apps have their own copies of shared code
- When updating shared logic, update BOTH copies:
  - `web/src/shared/`
  - `mobile/shared/`
- Ensure changes work on both platforms

### Testing
- Test your changes on both web and mobile platforms
- For web: Test in Chrome, Firefox, and Safari
- For mobile: Test with Expo Go on iOS and Android devices
- Verify that dice rolling produces expected results
- Test local storage persistence

### Commit Messages
Use clear, descriptive commit messages:
- `feat: add new dice type support`
- `fix: resolve roll history display issue`
- `docs: update setup instructions`
- `style: improve mobile UI responsiveness`

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Platform (web/mobile) and browser/device info
- Screenshots if applicable

## 💡 Feature Requests

For new features, please:
- Check existing issues first
- Describe the feature and its benefits
- Consider how it would work on both platforms
- Provide mockups or examples if helpful

## 🔄 Pull Request Process

1. **Create a feature branch** from main:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly** on both platforms

4. **Update documentation** if needed

5. **Commit your changes** with clear messages

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - List of changes made
   - Screenshots of UI changes
   - Testing notes

## 📝 Code Review

All submissions require review. We'll check for:
- Code quality and style
- TypeScript usage
- Cross-platform compatibility
- Performance considerations
- Security best practices

## 🎯 Areas for Contribution

Great areas to contribute:
- **UI/UX improvements**: Better animations, responsive design
- **New dice types**: Custom dice, specialty gaming dice
- **Export features**: Share rolls, export history
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Optimization, bundle size reduction
- **Testing**: Unit tests, integration tests
- **Documentation**: Tutorials, API docs

## ❓ Questions?

- Open an issue for discussion
- Check existing issues and documentation
- Be respectful and constructive in all interactions

## 📜 License

By contributing to Dicey, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Dicey! 🎲