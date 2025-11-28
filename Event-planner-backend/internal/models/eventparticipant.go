package models

type EventParticipant struct { 
	UserID  int    `json:"user_id"`	
	EventID int    `json:"event_id"`	
	Role    string `json:"role"`	
	Status  string `json:"status.omitempty"`
}

type InviteUserRequest struct {
	UserID     int    `json:"user_id"`
	EventID    int    `json:"event_id"`
	Role 	   string `json:"role"`
}


type participantRole string

var Role= struct {
Organizer participantRole
Invitee   participantRole 
Collaborator  participantRole
}{  Organizer     : "organizer",
	Invitee       : "invitee"  ,
	Collaborator  : "collaborator" ,}

type AttendeeStatus string
var Status  = struct{
	NotGoing AttendeeStatus 
	Going    AttendeeStatus 
	Maybe    AttendeeStatus 
}{ NotGoing  : "Not Going",
	Going    : "Going"    ,
	Maybe    : "Maybe"    , }
