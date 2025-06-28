## Thought Nest

A beautiful and personal diary application for capturing your thoughts, memories, and daily reflections.

## Features

- 📝 **Daily Journal Entries** - Write and organize your thoughts
- 📅 **Calendar View** - Browse your entries by date
- 😊 **Mood Tracking** - Record how you're feeling each day
- 🙏 **Gratitude Logging** - Practice gratitude with dedicated entries
- 🌙 **Dark/Light Mode** - Comfortable viewing in any lighting
- 📱 **Responsive Design** - Works perfectly on desktop and mobile

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/palaknagar-07/Thought-Nest.git>
   cd Thought-Nest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see your diary application.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Management**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── main.tsx           # Application entry point
```

## Development

### Adding New Features

1. Create new components in the `src/components/` directory
2. Add new pages in the `src/pages/` directory
3. Use the existing UI components from `src/components/ui/` for consistency
4. Follow the existing TypeScript patterns and naming conventions

### Styling

The project uses Tailwind CSS for styling. All custom styles should be added through Tailwind classes or by extending the Tailwind configuration in `tailwind.config.ts`.

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect your repository
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Any static hosting service**: Upload the contents of the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
# Thought-Nest
