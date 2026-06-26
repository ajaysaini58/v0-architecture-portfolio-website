'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Briefcase, Building2, Scroll, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signUpUser, createUserProfile, createArchitectProfile, createClientProfile, createStudentProfile, createHRProfile } from '@/lib/supabase';
import type { UserRole } from '@/lib/types';

type SignupStep = 'role-select' | 'basic-info' | 'role-details' | 'confirmation';

const SPECIALTIES = [
  'Residential Design',
  'Commercial Design',
  'Sustainable Design',
  'Interior Design',
  'Urban Planning',
  'Landscape Design',
  'Heritage Conservation',
  'Parametric Design',
  'BIM & 3D Modeling',
  'Green Building',
];

const COMPANY_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company' },
  { value: 'startup', label: 'Startup' },
  { value: 'government', label: 'Government' },
];

const INDUSTRIES = [
  'Real Estate',
  'Construction',
  'Tech',
  'Healthcare',
  'Education',
  'Retail',
  'Hospitality',
  'Manufacturing',
  'Finance',
  'Other',
];

const roleConfig = {
  architect: {
    icon: Briefcase,
    title: 'Architect',
    description: 'Showcase your portfolio and bid on projects',
    color: 'bg-blue-600',
  },
  client: {
    icon: Building2,
    title: 'Client',
    description: 'Post projects and hire architects',
    color: 'bg-amber-600',
  },
  company_hr: {
    icon: Scroll,
    title: 'HR/Recruiter',
    description: 'Post job opportunities',
    color: 'bg-purple-600',
  },
  student: {
    icon: GraduationCap,
    title: 'Student',
    description: 'Find internships and mentorship',
    color: 'bg-green-600',
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>('role-select');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    // Basic info
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    // Architect
    specialties: [] as string[],
    experience_years: '',
    hourly_rate: '',
    website_url: '',
    // Client
    company_name: '',
    company_type: '',
    industry: '',
    // Student
    university: '',
    degree: '',
    graduation_year: '',
    interests: [] as string[],
    seeking_internship: true,
    seeking_mentorship: true,
    // HR
    department: '',
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('basic-info');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateBasicInfo = () => {
    if (!formData.full_name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateRoleDetails = () => {
    if (selectedRole === 'architect') {
      if (formData.specialties.length === 0) {
        setError('Please select at least one specialty');
        return false;
      }
    } else if (selectedRole === 'company_hr') {
      if (!formData.company_name.trim()) {
        setError('Please enter your company name');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'basic-info') {
      if (!validateBasicInfo()) return;
      setStep('role-details');
      return;
    }

    if (step === 'role-details') {
      if (!validateRoleDetails()) return;
      setStep('confirmation');
      return;
    }

    if (step === 'confirmation') {
      setIsLoading(true);
      try {
        // 1. Sign up with Supabase Auth
        const authData = await signUpUser(formData.email, formData.password);

        if (!authData.user) {
          throw new Error('Failed to create account. Please try again.');
        }

        const userId = authData.user.id;

        // 2. Create user profile
        await createUserProfile(userId, formData.email, formData.full_name, selectedRole || 'client');

        // 3. Create role-specific profiles
        if (selectedRole === 'architect') {
          await createArchitectProfile(
            userId,
            formData.specialties,
            formData.experience_years ? parseInt(formData.experience_years) : undefined,
            formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
            formData.website_url || undefined
          );
        } else if (selectedRole === 'client') {
          await createClientProfile(
            userId,
            formData.company_name || undefined,
            formData.company_type || undefined,
            formData.industry || undefined
          );
        } else if (selectedRole === 'student') {
          await createStudentProfile(
            userId,
            formData.university || undefined,
            formData.degree || undefined,
            formData.graduation_year ? parseInt(formData.graduation_year) : undefined,
            formData.interests
          );
        } else if (selectedRole === 'company_hr') {
          await createHRProfile(userId, formData.company_name, formData.department || undefined);
        }

        setEmailSent(true);

        // Redirect after delay
        setTimeout(() => {
          router.push('/signin?registered=true');
        }, 3000);
      } catch (err: any) {
        console.error('Signup error:', err);
        setError(err.message || 'An error occurred during signup. Please try again.');
        setIsLoading(false);
      }
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <CardTitle>Account Created!</CardTitle>
            <CardDescription className="mt-2">
              Please check your email to confirm your account. We&apos;ll redirect you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Redirecting to sign in...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        {step !== 'role-select' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(step === 'basic-info' ? 'role-select' : step === 'role-details' ? 'basic-info' : 'role-details')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {step === 'basic-info' ? 1 : step === 'role-details' ? 2 : 3} of 3
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{
                  width:
                    step === 'basic-info'
                      ? '33%'
                      : step === 'role-details'
                        ? '66%'
                        : '100%',
                }}
              />
            </div>
          </div>
        )}

        {/* Role Selection */}
        {step === 'role-select' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Join the Community</h1>
              <p className="text-muted-foreground">Choose your role to get started</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(roleConfig) as Array<[UserRole, typeof roleConfig[UserRole]]>).map(
                ([roleKey, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleSelect(roleKey)}
                      className="group"
                    >
                      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary cursor-pointer">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className={`${config.color} p-3 rounded-lg mb-4 text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{config.title}</h3>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </CardContent>
                      </Card>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Basic Information */}
        {step === 'basic-info' && selectedRole && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>Enter your basic information to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="At least 8 characters"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Role-Specific Details */}
        {step === 'role-details' && selectedRole && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>Tell us more about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Architect Details */}
                {selectedRole === 'architect' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Specialties (Select at least one)</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {SPECIALTIES.map((specialty) => (
                          <button
                            key={specialty}
                            type="button"
                            onClick={() => handleSpecialtyToggle(specialty)}
                            className={`p-3 rounded-lg border-2 transition-all text-sm font-medium text-left ${
                              formData.specialties.includes(specialty)
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-card text-foreground hover:border-primary/50'
                            }`}
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experience_years">Years of Experience</Label>
                        <Input
                          id="experience_years"
                          name="experience_years"
                          type="number"
                          value={formData.experience_years}
                          onChange={handleInputChange}
                          placeholder="e.g., 5"
                          min="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                        <Input
                          id="hourly_rate"
                          name="hourly_rate"
                          type="number"
                          value={formData.hourly_rate}
                          onChange={handleInputChange}
                          placeholder="e.g., 75"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website_url">Website (Optional)</Label>
                      <Input
                        id="website_url"
                        name="website_url"
                        type="url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                )}

                {/* Client Details */}
                {selectedRole === 'client' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company_type">Company Type</Label>
                      <Select value={formData.company_type} onValueChange={(value) => handleSelectChange('company_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="company_name">Company Name (Optional)</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry">Industry (Optional)</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleSelectChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Student Details */}
                {selectedRole === 'student' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="university">University (Optional)</Label>
                      <Input
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        placeholder="Your university"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="degree">Degree (Optional)</Label>
                        <Input
                          id="degree"
                          name="degree"
                          value={formData.degree}
                          onChange={handleInputChange}
                          placeholder="e.g., B.Arch"
                        />
                      </div>

                      <div>
                        <Label htmlFor="graduation_year">Graduation Year</Label>
                        <Input
                          id="graduation_year"
                          name="graduation_year"
                          type="number"
                          value={formData.graduation_year}
                          onChange={handleInputChange}
                          placeholder="e.g., 2025"
                          min="2000"
                          max="2100"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>What are you looking for?</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="seeking_internship"
                            checked={formData.seeking_internship}
                            onCheckedChange={(checked) => handleCheckboxChange('seeking_internship', checked === true)}
                          />
                          <Label htmlFor="seeking_internship" className="font-normal cursor-pointer">
                            Internship opportunities
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="seeking_mentorship"
                            checked={formData.seeking_mentorship}
                            onCheckedChange={(checked) => handleCheckboxChange('seeking_mentorship', checked === true)}
                          />
                          <Label htmlFor="seeking_mentorship" className="font-normal cursor-pointer">
                            Mentorship
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* HR Details */}
                {selectedRole === 'company_hr' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="Your company"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="department">Department (Optional)</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Human Resources"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Review & Confirm */}
        {step === 'confirmation' && selectedRole && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Information</CardTitle>
              <CardDescription>Please verify your details before creating your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Account Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="text-foreground font-medium">{formData.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="text-foreground font-medium">{roleConfig[selectedRole].title}</span>
                      </div>
                    </div>
                  </div>

                  {selectedRole === 'architect' && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Professional Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Specialties:</span>
                          <span className="text-foreground font-medium">{formData.specialties.length} selected</span>
                        </div>
                        {formData.experience_years && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="text-foreground font-medium">{formData.experience_years} years</span>
                          </div>
                        )}
                        {formData.hourly_rate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hourly Rate:</span>
                            <span className="text-foreground font-medium">${formData.hourly_rate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedRole === 'client' && formData.company_name && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Company Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company:</span>
                          <span className="text-foreground font-medium">{formData.company_name}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'company_hr' && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">HR Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company:</span>
                          <span className="text-foreground font-medium">{formData.company_name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
                  <p className="text-sm text-info">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sign In Link */}
        {step === 'role-select' && (
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
