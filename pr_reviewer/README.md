# PR Review Agent UI

A modern React/Next.js frontend for the PR Review Agent with AgentOps replay capabilities.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd pr-review-agent-ui
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main PR Review Agent component
├── components/
│   └── ui/                # Reusable UI components (shadcn/ui)
├── lib/
│   └── utils.ts           # Utility functions
├── package.json
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## Features

- **PR Review Interface**: Clean interface for reviewing GitHub PRs
- **Criteria-Driven Reviews**: Configurable review modes (Performance, Security, Style, etc.)
- **Reasoning Flow Visualization**: Graph-based visualization of agent decision-making
- **Timeline View**: Step-by-step breakdown of the review process
- **Replay Capabilities**: Deterministic replay and counterfactual analysis
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Customization

### Adding New Review Criteria

Edit the \`selectedCriteria\` options in \`app/page.tsx\`:

\`\`\`tsx
<SelectItem value="custom-criteria">Custom Criteria</SelectItem>
\`\`\`

### Styling

The project uses Tailwind CSS with a custom design system. Colors and spacing can be customized in:

- \`tailwind.config.js\` - Tailwind configuration
- \`app/globals.css\` - CSS custom properties

### Components

All UI components are located in \`components/ui/\` and follow the shadcn/ui pattern. They're fully customizable and accessible.

## Integration with Backend

To connect this frontend with your PR Review Agent backend:

1. Create API routes in \`app/api/\`
2. Add data fetching hooks
3. Replace mock data with real API calls
4. Add authentication if needed

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
\`\`\`

Now you have a complete, production-ready React project! Here's how to get started:

## Quick Setup Instructions:

1. **Create a new directory** for your project:
\`\`\`bash
mkdir pr-review-agent-ui
cd pr-review-agent-ui
\`\`\`

2. **Copy all the files** from the code project above into your directory

3. **Install dependencies**:
\`\`\`bash
npm install
\`\`\`

4. **Run the development server**:
\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser** to `http://localhost:3000`

## What You Get:

✅ **Complete Next.js 14 setup** with App Router
✅ **All shadcn/ui components** properly configured  
✅ **Tailwind CSS** with custom design system
✅ **TypeScript** configuration
✅ **Responsive design** that works on all devices
✅ **Professional UI** ready for production
✅ **Easy customization** and extension

## Next Steps:

1. **Connect to your backend** - Add API routes in `app/api/`
2. **Add real data** - Replace mock data with actual API calls  
3. **Add authentication** - Integrate with GitHub OAuth or similar
4. **Deploy** - Push to Vercel, Netlify, or your preferred platform

The project is structured to be easily extensible - you can add new pages, components, and features as your PR Review Agent backend develops!
