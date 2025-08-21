# Hair Loss Quiz 🧬

A comprehensive, interactive quiz application designed to help users understand their hair loss situation and discover personalized solutions. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Interactive Quiz Flow**: 15+ targeted questions about hair loss
- **Conditional Logic**: Dynamic question flow based on gender and previous answers
- **Personalized Results**: Custom analysis based on user responses
- **Advanced Analytics**: Google Analytics 4 and Facebook Pixel tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety and modern development experience

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Analytics**: Google Analytics 4, Facebook Pixel
- **Deployment**: Ready for Netlify, Vercel, or GitHub Pages

## 📱 Quiz Features

### Question Types
- **Demographic Questions**: Age, gender, life situation
- **Hair Loss Assessment**: Main problems, duration, severity
- **Lifestyle Factors**: Hormonal impact, stress, treatments tried
- **Emotional Impact**: Social effects, relationships, biggest fears
- **Motivation**: How desperately they want results

### Conditional Logic
- Gender-specific question paths
- Dynamic severity calculation
- Personalized avatar detection
- Custom result generation

### Analytics Tracking
- **Quiz Progression**: Start, question views, answers, completion
- **User Behavior**: Time spent, scroll depth, hover interactions
- **Conversion Tracking**: CTA clicks, popup interactions
- **Performance Metrics**: Dropoff points, completion rates

## 🛠️ Setup & Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hair-loss-quiz.git
   cd hair-loss-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📊 Analytics Setup

### Google Analytics 4
1. Create a GA4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Update `GA_TRACKING_ID` in `src/App.tsx`
4. Add GA4 script to your HTML

### Facebook Pixel
1. Create a Facebook Pixel
2. Get your Pixel ID
3. Add Facebook Pixel script to your HTML

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy automatically on push

### Vercel
1. Import your GitHub repository
2. Framework preset: Vite
3. Deploy automatically on push

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Use the provided workflow

## 📁 Project Structure

```
src/
├── App.tsx              # Main application component
├── index.css            # Global styles and Tailwind imports
├── main.tsx             # Application entry point
└── vite-env.d.ts        # Vite type definitions

public/                  # Static assets
├── index.html           # HTML template
└── favicon.ico          # Site icon
```

## 🎯 Customization

### Quiz Questions
Edit the `getAllQuestions()` function in `src/App.tsx` to:
- Add new questions
- Modify question flow
- Update conditional logic
- Change answer options

### Styling
- Modify Tailwind classes in components
- Update color schemes in `tailwind.config.js`
- Customize animations and transitions

### Analytics
- Add new tracking events
- Modify event parameters
- Integrate additional analytics platforms

## 🔧 Configuration

### Environment Variables
Create a `.env` file for:
- API keys
- Analytics IDs
- External service URLs

### Build Configuration
Modify `vite.config.ts` for:
- Build optimizations
- Asset handling
- Development server settings

## 📈 Performance

- **Lazy Loading**: Components load on demand
- **Optimized Images**: WebP format with fallbacks
- **Minified Builds**: Production-ready optimization
- **CDN Ready**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or support:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for better hair health awareness**
