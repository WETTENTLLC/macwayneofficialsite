import { NextRequest, NextResponse } from 'next/server';

// For static export compatibility
export const dynamic = "force-static";

// Mock database - in production, use a real database
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    isDeputyMember: false,
    loyaltyPoints: 0
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (in production, hash passwords)
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token: `mock_token_${user.id}_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
