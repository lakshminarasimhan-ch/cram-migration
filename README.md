# Cram Mongo - Database Migration Documentation

A Next.js application documenting MongoDB to PostgreSQL and MySQL to PostgreSQL database migration processes.

## Features

- 📚 **Documentation Pages**: Comprehensive guides for database migrations
- 💬 **Interactive Comments**: Users can comment on text selections with threaded discussions
- 🎯 **Scroll & Glow**: Click comments in sidebar to scroll to and highlight text
- 🎨 **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run database migrations (if needed):
   ```bash
   # Apply Supabase migrations
   npx supabase db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Netlify Manual Upload (Recommended)

1. **Create deployment folder:**
   ```bash
   npm run create-deploy-folder
   ```
   This creates `cram-mongo-deploy/` folder (~0.36MB) excluding node_modules and build artifacts.

2. **Upload to Netlify:**
   - Go to Netlify dashboard → Sites → Deploy manually
   - Drag and drop the entire `cram-mongo-deploy` folder
   - Netlify automatically builds using the Next.js plugin

3. **Set environment variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note:** This deployment uses the `@netlify/plugin-nextjs` which provides optimal Next.js support with proper routing and server-side rendering.

### GitHub Integration (Alternative)

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (handled by `netlify.toml`)
3. Add environment variables in Netlify dashboard
4. Deploy!

The `netlify.toml` file handles all build configuration automatically.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── styles/             # CSS styles
├── supabase/
│   └── migrations/         # Database migrations
├── netlify.toml           # Netlify configuration
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run create-deploy-folder` - Create clean deployment folder (excludes node_modules, build files, etc.)

## Database Schema

The application uses Supabase with tables for:
- Comments system with threaded replies
- User management
- Document highlighting

Migrations are located in `supabase/migrations/`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
