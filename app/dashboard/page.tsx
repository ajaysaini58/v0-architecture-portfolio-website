'use client';

import { useAuth, useRequireAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import Link from 'next/link';
import { Briefcase, FileText, MessageSquare, Users, Settings, LogOut, Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  useRequireAuth();
  const { user, role, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getDashboardContent = () => {
    switch (role) {
      case 'architect':
        return {
          title: 'Architect Dashboard',
          sections: [
            {
              icon: Briefcase,
              title: 'My Portfolio',
              description: 'Manage your portfolio items',
              action: { label: 'View Portfolio', href: '/architect/portfolio' },
            },
            {
              icon: FileText,
              title: 'Available Bids',
              description: 'Browse and bid on projects',
              action: { label: 'View Projects', href: '/projects' },
            },
            {
              icon: MessageSquare,
              title: 'Messages',
              description: 'Connect with clients',
              action: { label: 'Messages', href: '/messages' },
            },
            {
              icon: Users,
              title: 'Profile',
              description: 'Update your professional information',
              action: { label: 'Edit Profile', href: '/architect/profile' },
            },
          ],
        };

      case 'client':
        return {
          title: 'Client Dashboard',
          sections: [
            {
              icon: Plus,
              title: 'Post a Project',
              description: 'Create a new project listing',
              action: { label: 'Post Project', href: '/client/post-project' },
            },
            {
              icon: FileText,
              title: 'My Projects',
              description: 'Manage your active projects',
              action: { label: 'View Projects', href: '/client/projects' },
            },
            {
              icon: MessageSquare,
              title: 'Messages',
              description: 'Communicate with architects',
              action: { label: 'Messages', href: '/messages' },
            },
            {
              icon: Users,
              title: 'Profile',
              description: 'Update your company information',
              action: { label: 'Edit Profile', href: '/client/profile' },
            },
          ],
        };

      case 'student':
        return {
          title: 'Student Dashboard',
          sections: [
            {
              icon: Briefcase,
              title: 'Internships',
              description: 'Find internship opportunities',
              action: { label: 'Browse', href: '/opportunities' },
            },
            {
              icon: Users,
              title: 'Mentors',
              description: 'Connect with experienced architects',
              action: { label: 'Find Mentors', href: '/mentors' },
            },
            {
              icon: MessageSquare,
              title: 'Messages',
              description: 'Chat with mentors and professionals',
              action: { label: 'Messages', href: '/messages' },
            },
            {
              icon: Users,
              title: 'Profile',
              description: 'Showcase your portfolio',
              action: { label: 'Edit Profile', href: '/student/profile' },
            },
          ],
        };

      case 'company_hr':
        return {
          title: 'HR Dashboard',
          sections: [
            {
              icon: Plus,
              title: 'Post Job',
              description: 'Create a new job listing',
              action: { label: 'Post Job', href: '/hr/post-job' },
            },
            {
              icon: FileText,
              title: 'Job Listings',
              description: 'Manage your job postings',
              action: { label: 'View Jobs', href: '/hr/jobs' },
            },
            {
              icon: Users,
              title: 'Applications',
              description: 'Review job applications',
              action: { label: 'View Applications', href: '/hr/applications' },
            },
            {
              icon: Users,
              title: 'Profile',
              description: 'Update company information',
              action: { label: 'Edit Profile', href: '/hr/profile' },
            },
          ],
        };

      default:
        return {
          title: 'Dashboard',
          sections: [],
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{content.title}</h1>
            <p className="text-muted-foreground">Welcome back, {user.full_name}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{user.full_name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{user.full_name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1 capitalize">{role} Account</p>
              </div>
              {!user.verified && (
                <div className="px-4 py-2 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-sm text-warning font-medium">Email Not Verified</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild size="sm" className="w-full">
                    <Link href={section.action.href}>{section.action.label}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/docs" className="p-3 hover:bg-muted rounded-lg transition-colors">
              <p className="font-medium text-foreground text-sm mb-1">Documentation</p>
              <p className="text-xs text-muted-foreground">Learn how to use ArchConnect</p>
            </Link>
            <Link href="/support" className="p-3 hover:bg-muted rounded-lg transition-colors">
              <p className="font-medium text-foreground text-sm mb-1">Contact Support</p>
              <p className="text-xs text-muted-foreground">Get help from our team</p>
            </Link>
            <Link href="/blog" className="p-3 hover:bg-muted rounded-lg transition-colors">
              <p className="font-medium text-foreground text-sm mb-1">Blog</p>
              <p className="text-xs text-muted-foreground">Read industry insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
