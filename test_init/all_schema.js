export const EVENTS_SCHEMA = "events";
export const EventsSchema = {
  name: EVENTS_SCHEMA,
  primaryKey: "EventID",
  properties: {
    EventID: "int",
    EventName: "string",
    EventDate: "string",
  },
};
