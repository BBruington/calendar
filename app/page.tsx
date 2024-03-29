"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import interactionPlugin, {
  DateClickArg,
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import {
  EventClickArg,
  EventDropArg,
  EventSourceInput,
} from "@fullcalendar/core/index.js";

interface Event {
  title: string;
  start: Date | string;
  message: string;
  isScheduled: boolean;
  allDay: boolean;
  id: string;
}

export default function Home() {
  const [unscheduledEvents, setUnscheduledEvents] = useState<Event[]>([
    {
      title: "event 1",
      id: "1",
      isScheduled: false,
      message: "hewwo uwu num 1",
      start: "",
      allDay: false,
    },
    {
      title: "event 2",
      id: "2",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 3",
      id: "3",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 4",
      id: "4",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 5",
      id: "5",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 6",
      id: "6",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 7",
      id: "7",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 8",
      id: "8",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 9",
      id: "9",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 10",
      id: "10",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
    {
      title: "event 11",
      id: "11",
      isScheduled: false,
      message: "hewwo uwu",
      start: "",
      allDay: false,
    },
  ]);

  const [scheduledEvents, setScheduledEvents] = useState<Event[]>([]);
  const [showScheduleEventModal, setShowScheduleEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    title: "",
    start: "",
    message: "",
    isScheduled: false,
    allDay: false,
    id: "0",
  });

  useEffect(() => {
    //this allows unscheduled events to be draggable / droppable onto the calendar
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let id = eventEl.getAttribute("data");
          let start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
  }, []);

  function showModalForCreateEvent(arg: DateClickArg) {
    setSelectedEvent({
      ...selectedEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime().toString(),
    });
    setShowScheduleEventModal(true);
  }

  function dropCalendarEventToNewDate(data: EventDropArg) {
    let currentEvent = scheduledEvents.find(
      (item) => item.id === data.event.id
    );
    const event = {
      ...selectedEvent,
      start: data.event.start !== null ? data.event.start.toISOString() : "",
      title: data.event.title,
      allDay: data.event.allDay,
      message: currentEvent?.message ? currentEvent.message : "",
      isScheduled: currentEvent?.isScheduled ? currentEvent.isScheduled : true,
      id: data.event.id,
    };
    setSelectedEvent(event);
    let selectedEvents = scheduledEvents.filter(
      (item) => item.id !== data.event.id
    );
    setScheduledEvents([...selectedEvents, event]);
  }

  function dropUnscheduledEventToCalendar(data: DropArg) {
    let currentEvent = unscheduledEvents.find(
      (item) => item.id === data.draggedEl.id
    );
    const event = {
      ...selectedEvent,
      start: data.date.toISOString(),
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      message: currentEvent?.message ? currentEvent.message : "",
      isScheduled: true,
      id: data.draggedEl.id,
    };
    setSelectedEvent(event);
    setScheduledEvents([...scheduledEvents, event]);
    if (currentEvent?.isScheduled === false) {
      let selectedEvents = unscheduledEvents.filter(
        (item) => item.id !== data.draggedEl.id
      );
      setUnscheduledEvents(selectedEvents);
    }
  }

  function showModalForUnscheduledEventOnclick(selectedEvent: Event) {
    setIdToDelete(selectedEvent.id);
    const currentEvent = unscheduledEvents.find(
      (event) => event.id === selectedEvent.id
    );
    if (currentEvent) {
      setSelectedEvent({
        ...currentEvent,
        start: "unscheduled",
        allDay: false,
      });
    }
    setShowEditEventModal(true);
    setIdToDelete(selectedEvent.id);
  }

  function handleEventClick(data: EventClickArg) {
    const currentEvent = scheduledEvents.find(
      (event) => event.id === data.event.id
    );
    if (currentEvent) {
      setSelectedEvent(currentEvent);
    }
    setShowEditEventModal(true);
    setIdToDelete(data.event.id);
  }

  function handleDeleteEvent() {
    if (selectedEvent.isScheduled === true) {
      setScheduledEvents(
        scheduledEvents.filter((event) => event.id !== idToDelete)
      );
    } else {
      setUnscheduledEvents(
        unscheduledEvents.filter((event) => event.id !== idToDelete)
      );
    }
    setSelectedEvent({
      title: "",
      start: "",
      message: "",
      isScheduled: false,
      allDay: false,
      id: "0",
    });
    setShowEditEventModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setSelectedEvent({
      title: "",
      start: "",
      message: "",
      isScheduled: false,
      allDay: false,
      id: "0",
    });
    setShowScheduleEventModal(false);
    setShowEditEventModal(false);
    setIdToDelete(null);
  }

  const handleModalOnchange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setSelectedEvent({
      ...selectedEvent,
      [name]: value,
    });
  };

  function handleEditEventModalUpsert(isScheduled: boolean) {
    if (isScheduled === true) {
      setScheduledEvents([
        ...scheduledEvents.filter((event) => event.id !== selectedEvent.id),
        selectedEvent,
      ]);
    } else {
      setUnscheduledEvents([
        ...unscheduledEvents.filter((event) => event.id !== selectedEvent.id),
        selectedEvent,
      ]);
    }
    setSelectedEvent({
      title: "",
      start: "",
      message: "",
      isScheduled: false,
      allDay: false,
      id: "0",
    });
    setShowEditEventModal(false);
  }

  function handleAddEventToCalendar() {
    setScheduledEvents([...scheduledEvents, selectedEvent]);
    setSelectedEvent({
      title: "",
      start: "",
      message: "",
      isScheduled: false,
      allDay: false,
      id: "0",
    });
    setShowScheduleEventModal(false);
  }

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <main className="flex w-full min-h-screen flex-col items-center justify-center p-24">
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 md:col-span-9">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
              }}
              events={scheduledEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={showModalForCreateEvent}
              drop={(data) => dropUnscheduledEventToCalendar(data)}
              eventClick={(data) => handleEventClick(data)}
              eventDrop={(data) => dropCalendarEventToNewDate(data)}
            />
          </div>
          <div
            id="draggable-el"
            className="ml-8 invisible md:visible  md:col-span-2 w-full border-2 p-2 rounded-md mt-16 h-2/3 bg-violet-50"
          >
            <h1 className="font-bold text-lg text-center">
              Unscheduled Events
            </h1>
            <div className="flex flex-col justify-between h-full">
              <div className="overflow-y-auto overflow-x-hidden">
                {unscheduledEvents.map((event) => (
                  <div title={event.title} id={event.id} key={event.id}>
                    <button
                      className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white hover:cursor"
                      onClick={() => showModalForUnscheduledEventOnclick(event)}
                      title={event.title}
                      id={event.id}
                      key={event.id}
                    >
                      {event.title}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowEditEventModal(true)}
                className="mb-12 mt-3"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* edit event modal */}
        <Dialog open={showEditEventModal} onOpenChange={handleCloseModal}>
          <DialogContent
            onInteractOutside={() => handleCloseModal}
            className="sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              {selectedEvent.isScheduled === true && (
                <DialogDescription>
                  {selectedEvent.title} is scheduled for{" "}
                  {new Date(
                    selectedEvent.start.toLocaleString()
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  at{" "}
                  {new Date(
                    selectedEvent.start.toLocaleString()
                  ).toLocaleDateString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Name
                </Label>
                <Input
                  value={selectedEvent.title}
                  onChange={(e) => handleModalOnchange(e)}
                  placeholder="Name"
                  name="title"
                  id="title"
                  defaultValue="Edited Event"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Input
                  value={selectedEvent.message}
                  onChange={(e) => handleModalOnchange(e)}
                  placeholder="Message"
                  name="message"
                  id="message"
                  defaultValue="Edited Event Message"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button onClick={handleDeleteEvent} className="bg-red-600">
                Delete
              </Button>
              <Button
                onClick={() =>
                  handleEditEventModalUpsert(
                    selectedEvent.isScheduled === true ? true : false
                  )
                }
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* add an event modal */}
        <Dialog open={showScheduleEventModal} onOpenChange={handleCloseModal}>
          <DialogContent
            onInteractOutside={handleCloseModal}
            className="sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Add a new event to the calendar
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Name
                </Label>
                <Input
                  value={selectedEvent.title}
                  onChange={(e) => handleModalOnchange(e)}
                  placeholder="Name"
                  name="title"
                  id="title"
                  defaultValue="New Event"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Input
                  value={selectedEvent.message}
                  onChange={(e) => handleModalOnchange(e)}
                  placeholder="Message"
                  name="message"
                  id="message"
                  defaultValue="New Event Message"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEventToCalendar}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
