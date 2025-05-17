# Live Show Features Documentation

## Overview

The Red Lotus website now includes enhanced live show features allowing fans to purchase tickets for upcoming performances and access exclusive streaming content.

## Features

- **Upcoming Shows Listing**: Displays all scheduled live performances
- **Ticket Purchase System**: Allows fans to buy tickets with custom "pay what you want" pricing
- **Merchandise Integration**: Fans can add merchandise items during ticket purchase
- **Access Code System**: Unique codes provided after purchase to access exclusive content
- **Live Stream Player**: Secure video streaming with YouTube or direct video support

## Setup Requirements

1. **Firebase Setup**:
   - Firestore collections needed: `liveShows`, `liveTickets`, `analytics`
   - Storage bucket for video content

2. **Live Show Collection Structure**:
   ```
   liveShows/{showId}
   {
     title: string,
     date: string,
     price: number,
     description: string,
     streamUrl?: string, // YouTube or direct video URL
     previewImageUrl?: string,
     isActive: boolean
   }
   ```

3. **Tickets Collection Structure**:
   ```
   liveTickets/{ticketId}
   {
     showId: string,
     userId: string,
     userEmail: string,
     purchaseDate: timestamp,
     amount: number,
     status: "active" | "used" | "expired",
     accessCode: string
   }
   ```

4. **Analytics Structure**:
   ```
   analytics/liveShows
   {
     [showId]: {
       tickets: number,
       revenue: number
     }
   }
   ```

## Implementation Notes

### Access Management
- Access codes are generated during purchase
- Codes are verified server-side before streaming content is displayed
- Access can be revoked by admins if needed

### Analytics Tracking
- Ticket purchases, views, and engagement metrics are tracked
- Data appears in admin analytics dashboard

### Content Streaming
- YouTube embedded videos for pre-recorded content
- Direct video links for custom content

## Security Considerations

Security is managed through Firebase Authentication and Firestore rules:

1. Only administrators can create/edit live shows
2. Users can only access streams with valid access codes
3. Purchase data is protected and only accessible by the purchasing user or admins

## Development Environment

For development testing, mock shows can be created in the Firebase console or via the admin interface.

## Future Enhancements

Planned future enhancements:
- Live chat during performances
- Multi-camera angle selection
- Downloadable recordings after events
- Virtual backstage pass experiences
