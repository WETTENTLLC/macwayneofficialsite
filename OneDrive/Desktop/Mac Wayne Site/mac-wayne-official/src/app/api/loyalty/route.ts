import { NextRequest, NextResponse } from 'next/server';

// Mock loyalty data
const mockLoyalty = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const loyalty = mockLoyalty.get(userId) || {
      userId,
      points: 0,
      tier: 'Supporter',
      totalSpent: 0,
      purchases: [],
      rewards: []
    };
    
    return NextResponse.json({ loyalty });
  } catch (error) {
    console.error('Get loyalty error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, amount, orderId } = await request.json();
    
    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let loyalty = mockLoyalty.get(userId) || {
      userId,
      points: 0,
      tier: 'Supporter',
      totalSpent: 0,
      purchases: [],
      rewards: []
    };

    switch (action) {
      case 'purchase':
        if (amount) {
          loyalty.points += Math.floor(amount); // 1 point per dollar
          loyalty.totalSpent += amount;
          loyalty.purchases.push({
            orderId,
            amount,
            points: Math.floor(amount),
            date: new Date()
          });
        }
        break;
      
      case 'redeem':
        if (amount && loyalty.points >= amount) {
          loyalty.points -= amount;
          loyalty.rewards.push({
            points: amount,
            redeemed: new Date()
          });
        } else {
          return NextResponse.json(
            { error: 'Insufficient points' },
            { status: 400 }
          );
        }
        break;
      
      case 'bonus':
        if (amount) {
          loyalty.points += amount;
        }
        break;
    }

    // Update tier based on total spent
    if (loyalty.totalSpent >= 500) {
      loyalty.tier = 'Deputy';
    } else if (loyalty.totalSpent >= 200) {
      loyalty.tier = 'Vision Holder';
    } else if (loyalty.totalSpent >= 50) {
      loyalty.tier = 'Believer';
    }

    mockLoyalty.set(userId, loyalty);
    
    return NextResponse.json({ loyalty });
  } catch (error) {
    console.error('Update loyalty error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
