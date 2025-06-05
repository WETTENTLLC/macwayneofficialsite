import { NextRequest, NextResponse } from 'next/server';

// Mock cart storage - in production, use database or session storage
const mockCarts = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'anonymous';
    
    const cart = mockCarts.get(sessionId) || [];
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId = 'anonymous', productId, name, price, image, quantity = 1 } = await request.json();
    
    if (!productId || !name || !price) {
      return NextResponse.json(
        { error: 'Product ID, name, and price are required' },
        { status: 400 }
      );
    }

    let cart = mockCarts.get(sessionId) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: Date.now().toString(),
        productId,
        name,
        price,
        image,
        quantity
      });
    }
    
    mockCarts.set(sessionId, cart);
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { sessionId = 'anonymous', itemId, quantity } = await request.json();
    
    let cart = mockCarts.get(sessionId) || [];
    
    if (quantity <= 0) {
      // Remove item
      cart = cart.filter((item: any) => item.id !== itemId);
    } else {
      // Update quantity
      const itemIndex = cart.findIndex((item: any) => item.id === itemId);
      if (itemIndex > -1) {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    mockCarts.set(sessionId, cart);
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId') || 'anonymous';
    const itemId = searchParams.get('itemId');
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    let cart = mockCarts.get(sessionId) || [];
    cart = cart.filter((item: any) => item.id !== itemId);
    mockCarts.set(sessionId, cart);
    
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
