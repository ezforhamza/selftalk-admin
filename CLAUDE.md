# CLAUDE.md - Self Talk Development Guide

## Project Overview
Self Talk is a modern React admin panel built with React 19, TypeScript, Vite, and Tailwind CSS v4. This guide serves as a comprehensive reference for reusable components, design patterns, and development practices.

## Quick Commands
```bash
pnpm dev          # Start development server (http://localhost:3001)
pnpm build        # Build for production (TypeScript check + Vite build)  
pnpm preview      # Preview production build
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
```

---

## Architecture Overview

### Tech Stack
- **Frontend**: React 19.1.0 + TypeScript 5.6.3
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.1.3 + Vanilla Extract + Styled Components
- **UI Components**: shadcn/ui + Ant Design 5.22.1
- **Icons**: Iconify + Lucide React
- **Animation**: Motion (Framer Motion) 12.9.0
- **State Management**: Zustand 4.5.5
- **Data Fetching**: React Query 5.60.2
- **Routing**: React Router 7.0.2
- **Forms**: React Hook Form 7.56.1 + Zod 3.24.3
- **Mocking**: MSW 2.6.4 + Faker.js 8.4.1

### Directory Structure
```
src/
├── _mock/                    # MSW mock data and handlers
├── api/                      # API services layer
├── assets/                   # Static assets (icons, images)
├── components/               # Reusable components
├── hooks/                    # Custom React hooks
├── layouts/                  # Layout components
├── locales/                  # Internationalization files
├── pages/                    # Page components
│   ├── components/           # Reusable UI component showcases
│   ├── dashboard/            # Main dashboard page
│   └── sys/                  # System pages (auth, errors)
├── routes/                   # Routing configuration
├── store/                    # Zustand stores
├── theme/                    # Design system tokens
├── types/                    # TypeScript type definitions
├── ui/                       # shadcn/ui components
├── utils/                    # Utility functions
└── App.tsx                   # Root application component
```

> **Note**: This is a cleaned-up version of the Slash Admin template, renamed to Self Talk with demo pages removed. Only essential pages remain:
> - **Dashboard**: Main application entry point
> - **Components**: Reusable UI component showcases for development reference
> - **System pages**: Authentication and error handling

---

## Design System

### Theme Configuration
The project uses a sophisticated theming system with Vanilla Extract:

```typescript
// Theme mode switching
enum ThemeMode {
  Light = 'light',
  Dark = 'dark'
}

// Color presets available
enum ThemeColorPresets {
  Default = 'default', // Green: #00A76F
  Cyan = 'cyan',       // #078DEE
  Purple = 'purple',   // #7635DC  
  Blue = 'blue',       // #2065D1
  Orange = 'orange',   // #FFC700
  Red = 'red'          // #FF3030
}
```

**Location**: `/src/theme/theme.css.ts`

### CSS Custom Properties
```css
:root {
  --layout-nav-width: 260px;
  --layout-nav-width-mini: 88px;
  --layout-header-height: 64px;
  --layout-multi-tabs-height: 48px;
}
```

### Tailwind Configuration
**Location**: `/tailwind.config.ts`
- Custom color system with channel support
- Design token integration
- Dark mode selector: `[data-theme-mode='dark']`

---

## Reusable Components

### 1. UI Components (`/src/ui/`)
Based on shadcn/ui with custom enhancements:

#### Button (`/src/ui/button.tsx`)
```tsx
<Button variant="default|destructive|outline|secondary|ghost|link|contrast" 
        size="default|sm|lg|icon">
  Click me
</Button>
```

#### Card (`/src/ui/card.tsx`)
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

#### Sidebar (`/src/ui/sidebar.tsx`)
Advanced sidebar with state persistence:
```tsx
<SidebarProvider>
  <Sidebar variant="sidebar|floating|inset" 
           collapsible="offcanvas|icon|none">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Item</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
```

### 2. Custom Components (`/src/components/`)

#### Icon (`/src/components/icon/`)
Unified icon system supporting multiple sources:
```tsx
<Icon icon="local:ic-dashboard" size="24" />           // Local SVG
<Icon icon="lucide:home" size="24" />                 // Iconify
<Icon icon="url:https://example.com/icon.svg" />      // External URL
```

**Icon Registration**: `/src/components/icon/register-icons.ts`

#### Animation (`/src/components/animate/`)
Motion (Framer Motion) integration with pre-built variants:

```tsx
import { MotionContainer, varFade } from '@/components/animate';

<MotionContainer>
  <m.div variants={varFade().inUp}>
    Animated content
  </m.div>
</MotionContainer>
```

**Available Variants**:
- `varFade()` - in, inUp, inDown, inLeft, inRight, out, outUp, outDown, outLeft, outRight
- `varSlide()` - Directional slide animations
- `varScale()` - Scale in/out animations
- `varBounce()` - Bounce effects
- `varFlip()` - 3D flip animations
- `varZoom()` - Zoom effects
- `varRotate()` - Rotation animations

#### Chart (`/src/components/chart/`)
ApexCharts wrapper with optimized performance:
```tsx
import { Chart } from '@/components/chart';

<Chart
  type="line"
  series={data}
  options={{
    chart: { height: 350 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar'] }
  }}
/>
```

#### Upload (`/src/components/upload/`)
Ant Design Upload with custom styling:
```tsx
import { Upload } from '@/components/upload';

<Upload
  action="/api/upload"
  listType="picture"
  maxCount={5}
  thumbnail={true}
/>
```

#### Editor (`/src/components/editor/`)
React Quill rich text editor:
```tsx
import Editor from '@/components/editor';

<Editor
  value={content}
  onChange={setContent}
  sample={false} // Full toolbar
/>
```

#### Toast (`/src/components/toast/`)
Sonner toast notifications:
```tsx
import { toast } from '@/components/toast';

toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');
```

### 3. Layout Components (`/src/layouts/`)

#### Dashboard Layout (`/src/layouts/dashboard/`)
Main application layout with responsive behavior:

```tsx
// Automatic responsive layout selection
<DashboardLayout />
```

**Layout Variants**:
- **Mobile**: Sticky header + mobile nav drawer
- **Desktop Vertical**: Fixed sidebar + header + main content
- **Desktop Horizontal**: Header + horizontal nav + main content

#### Navigation (`/src/layouts/dashboard/nav/`)
Multi-format navigation system:
- **Vertical**: Full sidebar navigation
- **Horizontal**: Top navigation bar
- **Mini**: Collapsed sidebar with icons
- **Mobile**: Drawer navigation

### 4. Form Components

#### React Hook Form Integration
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
```

---

## State Management

### Zustand Stores (`/src/store/`)

#### Settings Store (`/src/store/settingStore.ts`)
```tsx
import { useSettings, useSettingActions } from '@/store/settingStore';

function Component() {
  const settings = useSettings();
  const { setSettings } = useSettingActions();
  
  const toggleTheme = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light'
    });
  };
}
```

#### User Store (`/src/store/userStore.ts`)
```tsx
import { useUserInfo, useUserActions } from '@/store/userStore';

function Component() {
  const userInfo = useUserInfo();
  const { setUserInfo, clearUserInfoAndToken } = useUserActions();
}
```

---

## API & Data Fetching

### API Services (`/src/api/services/`)
Axios-based API client with React Query integration:

```tsx
import { userService } from '@/api/services/userService';
import { useQuery, useMutation } from '@tanstack/react-query';

// GET request
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: userService.getUserList
});

// POST request  
const mutation = useMutation({
  mutationFn: userService.signin,
  onSuccess: (data) => {
    // Handle success
  }
});
```

### MSW Mock Implementation
**Configuration**: `/src/_mock/index.ts`
```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

**Mock Handlers**: `/src/_mock/handlers/`
- `_user.ts` - Authentication and user management
- `_menu.ts` - Navigation menu data
- `_demo.ts` - Testing utilities

**Faker.js Integration**:
```typescript
import { faker } from '@faker-js/faker';

const mockUser = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatarGitHub(),
  address: faker.location.streetAddress()
};
```

---

## Routing

### Route Configuration (`/src/routes/sections/`)

#### Protected Routes
```tsx
import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth';
import { RouteLoading } from '@/components/loading';

<Route
  path="/dashboard"
  element={
    <AuthGuard>
      <Suspense fallback={<RouteLoading />}>
        <DashboardLayout />
      </Suspense>
    </AuthGuard>
  }
/>
```

#### Lazy Loading
```tsx
import { lazy } from 'react';

const HomePage = lazy(() => import('@/pages/dashboard/workbench'));
const AnalysisPage = lazy(() => import('@/pages/dashboard/analysis'));
```

### Router Hooks (`/src/routes/hooks/`)
```tsx
import { useRouter, usePathname, useSearchParams } from '@/routes/hooks';

function Component() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleNavigate = () => {
    router.push('/dashboard');
  };
}
```

---

## Internationalization

### i18n Configuration (`/src/locales/`)
React i18next integration with language detection:

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  
  return <h1>{t('sys.nav.dashboard')}</h1>;
}
```

**Language Files**:
- `/src/locales/langs/en-us.ts` - English
- `/src/locales/langs/zh-cn.ts` - Chinese

**Locale Picker**:
```tsx
import { LocalePicker } from '@/components/locale-picker';

<LocalePicker />
```

---

## Custom Hooks

### Utility Hooks (`/src/hooks/`)

#### useMediaQuery
```tsx
import { useMediaQuery, up, down, between } from '@/hooks';

function Component() {
  const isMobile = useMediaQuery(down('md'));
  const isDesktop = useMediaQuery(up('lg'));
  const isTablet = useMediaQuery(between('md', 'lg'));
}
```

#### useTheme
```tsx
import { useTheme } from '@/hooks/use-theme';

function Component() {
  const { themeMode, toggleTheme, setThemeMode } = useTheme();
}
```

---

## Development Guidelines

### Code Style
- **Formatter**: Biome 2.1.3
- **Linter**: Biome (ESLint alternative)
- **Git Hooks**: Lefthook for pre-commit checks

### Component Conventions
1. **File Naming**: kebab-case for files, PascalCase for exports
2. **Import Order**: External deps → Internal modules → Relative imports
3. **Props Interface**: Define interface above component
4. **Default Props**: Use ES6 default parameters
5. **Ref Forwarding**: Use `React.forwardRef` when needed

### Example Component Structure:
```tsx
import { forwardRef } from 'react';
import { cn } from '@/utils';

interface ComponentProps {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Component = forwardRef<
  HTMLDivElement,
  ComponentProps
>(({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'base-classes',
        variant === 'secondary' && 'variant-classes',
        size === 'sm' && 'size-classes',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Component.displayName = 'Component';
```

### Performance Best Practices
1. **Code Splitting**: Use `lazy()` for route components
2. **Memoization**: Use `memo()` for expensive renders
3. **Virtual Scrolling**: For large lists (consider React Window)
4. **Image Optimization**: Use appropriate formats and lazy loading
5. **Bundle Analysis**: Use rollup-plugin-visualizer

### Testing Recommendations
1. **Unit Tests**: Jest + React Testing Library
2. **E2E Tests**: Playwright (recommended for admin panels)
3. **Visual Tests**: Storybook (component documentation)
4. **Mock Data**: Leverage existing MSW setup

---

## Deployment

### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MOCK=false
```

### Build Configuration
```json
{
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

### Vercel Deployment
Configuration in `/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `pnpm tsc --noEmit`
   - Verify imports are correct
   - Ensure all dependencies are installed

2. **Theme Not Applied**
   - Check theme mode in localStorage
   - Verify CSS custom properties are loaded
   - Ensure theme provider is wrapping the app

3. **Icons Not Loading**
   - Check icon name format: `local:icon-name`
   - Verify icon exists in `/src/assets/icons/`
   - Check Iconify icon name validity

4. **MSW Not Working**
   - Ensure service worker is registered
   - Check handler patterns match API calls
   - Verify MSW is enabled in development

### Performance Issues
1. **Slow Navigation**: Check for unnecessary re-renders
2. **Large Bundle**: Analyze with `rollup-plugin-visualizer`
3. **Memory Leaks**: Check for unsubscribed event listeners

---

## Contributing

### Git Workflow
```bash
# Feature development
git checkout -b feat/feature-name
git commit -m "feat: add new feature"

# Bug fixes  
git checkout -b fix/bug-description
git commit -m "fix: resolve issue with component"

# Documentation
git commit -m "docs: update component documentation"
```

### Commit Convention
Following conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Testing
- `chore:` - Build/tooling changes

---

## Resources

### Documentation
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [MSW](https://mswjs.io/)
- [Motion](https://motion.dev/)

### Design Inspiration
- [Ant Design](https://ant.design/)
- [Material-UI](https://mui.com/)
- [Chakra UI](https://chakra-ui.com/)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Slash Admin Team

This guide serves as a comprehensive reference for developing with the Slash Admin template. Keep it updated as new components and patterns are added to the project.