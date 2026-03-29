import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const metadata = await request.json();
    
    // Validate metadata
    if (!metadata.source || !metadata.work) {
      return NextResponse.json(
        { error: 'Missing required metadata fields' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `metadata-${timestamp}-${randomId}.json`;

    // Store metadata as JSON in Vercel Blob
    const blob = await put(filename, JSON.stringify(metadata), {
      access: 'public',
      contentType: 'application/json',
    });

    // Return short URL (will be stored on-chain)
    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error('Metadata storage error:', error);
    return NextResponse.json(
      { error: 'Failed to store metadata' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve metadata
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    // Fetch metadata from blob URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const metadata = await response.json();
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}

