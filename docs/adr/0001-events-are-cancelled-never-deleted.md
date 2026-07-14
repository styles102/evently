# Events are cancelled, never hard-deleted

Organizers can edit or cancel their events, but there is no delete. A cancelled event stays at its URL, marked Cancelled, keeping its RSVPs and comments; it just accepts no new ones. We chose this over hard delete because attendees' data (RSVPs, comments) shouldn't silently vanish, and dangling references from profiles and dashboards would otherwise need cascade handling everywhere. Anyone adding a "delete event" feature later: this was deliberate, not an oversight.
