# Evently

An Eventbrite-style event platform: users publish events and attend each other's events.

## Language

**Event**:
A gathering published on the platform that users can discover and attend. Has exactly one category, a start time (optional end), and is either in-person (venue + city) or online — never both. Creating an event publishes it; there are no drafts.

**Category**:
One of a fixed, seeded set of subject areas (e.g. Music, Tech). Every event has exactly one.
_Avoid_: Tag, topic

**Cancelled**:
An event state: the organizer has called it off. The event stays visible and keeps its RSVPs, but accepts no new ones. Events are never hard-deleted.
_Avoid_: Deleted, removed

**Organizer**:
The user who owns an event. Not a separate role — any signed-in user is the organizer of the events they created.
_Avoid_: Host, creator, admin

**RSVP**:
A user's public declaration of intent to attend an event. Visible to the organizer and counted toward attendance.
_Avoid_: Registered interest, registration, booking, ticket

**Favorite**:
A user's private bookmark of an event. Invisible to the organizer; carries no attendance signal.
_Avoid_: Like, save, watchlist, interested

**Attendee**:
A user with an active RSVP to an event. The organizer sees their event's attendees by name; everyone else sees only a count.
_Avoid_: Guest, participant

**Capacity**:
An optional per-event cap on RSVPs. A full event refuses new RSVPs; a cancellation frees a spot, first come first served (no waitlist).
_Avoid_: Limit, quota, tickets
