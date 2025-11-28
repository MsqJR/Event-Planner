### Event Management (Event Organizer Role only) 
- Users can create new events with a title, date, time, location, and description. 
- Users can view all events they have organized 
    - implement : list get_events()
- Users can view all events they are invited to. 
    - implement : list get_invited_events(User_Id)
- Users can invite others to attend or collaborate on an event. 
    - implement void invite_user(Attendee_Id, Event_Id)
- Users can delete events they have created. 
    - implement void delete_event(Event_Id)
- For each event of a user, the user must me marked as an “organizer” if he is the creator of the event or an “attendee”.
    - implement :void create_event(Event, user_id) -> uses user_id to cre

### Response Management 
- Attendees can indicate their attendance status for events (Going, Maybe, Not Going). 
    - implement : void set_status(event_id,User_id,status)
                
- Organizers can view the list of attendees and their statuses for each event. 
    - implement : list{User_id, status} get_attendee(Event_Id)
    


# Todo
- [x] create    : User class and User table
   - event structure : {
              "title" : string,
               "date" : date,
               "time" : time,
           "location" : string,
        "description" : string,
          "organizer" : User.id,
          "Attendees" : list{user.id:id, status:(enum{Going, NotGoing, Maybe})}
      }
- [x] implement : list get_organized_events()
- [x] implement : list get_invited_events(User_Id)
- [ ] implement : void create_event(Event, user_id) -> uses user_id to create an event with its description
- [x] implement : void invite_user(Attendee_Id, Event_Id)
- [ ] implement : void set_status(event_id,User_id,status)
- [ ] implement : list{User_id, status} get_attendee(Event_Id)
- [ ] implement : void delete_event(Event_Id)

