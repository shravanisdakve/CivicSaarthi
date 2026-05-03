/**
 * Utility for Google Calendar Integration
 */

export async function addEventToGoogleCalendar(eventDetails) {
  try {
    // 1. Check if user is authorized by trying to create an auth URL
    const statusRes = await fetch('/api/status');
    const statusData = await statusRes.json();
    
    if (!statusData.calendarConfigured) {
      alert('Google Calendar integration is currently not configured on the server.');
      return;
    }

    // 2. Request Auth URL
    const authRes = await fetch('/api/calendar/createAuthUrl');
    const authData = await authRes.json();
    
    if (authData.authUrl) {
      // In a real app, we'd open this in a popup or redirect
      // For this demo, let's open it in a new window
      const authWindow = window.open(authData.authUrl, 'GoogleAuth', 'width=600,height=600');
      
      // We'd need to wait for the callback to finish and then try creating the event
      // This is a bit complex for a one-shot, so let's provide a "Open Calendar" fallback too
      const checkAuth = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkAuth);
          // Try to create event now
          performCreateEvent(eventDetails);
        }
      }, 1000);
    }
  } catch {
    // Fallback to a simple Google Calendar link if API fails
    openGoogleCalendarLink(eventDetails);
  }
}

async function performCreateEvent(details) {
  try {
    const res = await fetch('/api/calendar/createEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    const data = await res.json();
    if (data.eventLink) {
      window.open(data.eventLink, '_blank');
    } else {
      // Fallback
      openGoogleCalendarLink(details);
    }
  } catch {
    openGoogleCalendarLink(details);
  }
}

/**
 * Fallback: Open a pre-filled Google Calendar link (no API key required)
 */
export function openGoogleCalendarLink(details) {
  const { summary, description, start, end } = details;
  
  // Format dates for Google Calendar URL (YYYYMMDDTHHMMSSZ)
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', summary || 'CivicSaarthi Event');
  url.searchParams.append('details', description || 'Event from CivicSaarthi.');
  url.searchParams.append('dates', `${formatDate(start)}/${formatDate(end)}`);
  
  window.open(url.toString(), '_blank');
}
