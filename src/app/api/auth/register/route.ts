import { NextRequest, NextResponse } from 'next/server';

// For static export compatibility
export const dynamic = "force-static";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isDeputyMember: boolean;
  loyaltyPoints: number;
  createdAt: string;
}

// Mock database - in production, use a real database
const mockUsers: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      password, // In production, hash this
      name,
      isDeputyMember: false,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock_token_${newUser.id}_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
