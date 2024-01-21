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
import { ExclamationTriangleIcon, CheckIcon } from "@heroicons/react/16/solid";
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
interface unscheduledEvent {
  title: string;
  id: string;
  isScheduled: boolean;
  message: string;
}

export default function Home() {
  const [unscheduledEvents, setUnscheduledEvents] = useState([
    {
      title: "event 1",
      id: "1",
      isScheduled: false,
      message: "hewwo uwu num 1",
    },
    { title: "event 2", id: "2", isScheduled: false, message: "hewwo uwu" },
    { title: "event 3", id: "3", isScheduled: false, message: "hewwo uwu" },
    { title: "event 4", id: "4", isScheduled: false, message: "hewwo uwu" },
    { title: "event 5", id: "5", isScheduled: false, message: "hewwo uwu" },
    { title: "event 6", id: "6", isScheduled: false, message: "hewwo uwu" },
    { title: "event 7", id: "7", isScheduled: false, message: "hewwo uwu" },
    { title: "event 8", id: "8", isScheduled: false, message: "hewwo uwu" },
    { title: "event 9", id: "9", isScheduled: false, message: "hewwo uwu" },
    { title: "event 10", id: "10", isScheduled: false, message: "hewwo uwu" },
    { title: "event 11", id: "11", isScheduled: false, message: "hewwo uwu" },
  ]);

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showmodal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  function handleDateClick(arg: DateClickArg) {
    setSelectedEvent({
      ...selectedEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime().toString(),
    });
    setShowModal(true);
  }

  function dropEvent(data: EventDropArg) {
    let currentEvent = allEvents.find((item) => item.id === data.event.id);
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
    let selectedEvents = allEvents.filter((item) => item.id !== data.event.id);
    setAllEvents([...selectedEvents, event]);
  }

  function addEvent(data: DropArg) {
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
    setAllEvents([...allEvents, event]);
    if (currentEvent?.isScheduled === false) {
      let selectedEvents = unscheduledEvents.filter(
        (item) => item.id !== data.draggedEl.id
      );
      setUnscheduledEvents(selectedEvents);
    }
  }

  function handleUnscheduledEventOnclick(selectedEvent: unscheduledEvent) {
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
    setShowDeleteModal(true);
    setIdToDelete(selectedEvent.id);
  }

  function handleEventClick(data: EventClickArg) {
    const currentEvent = allEvents.find((event) => event.id === data.event.id);
    if (currentEvent) {
      setSelectedEvent(currentEvent);
    }
    setShowDeleteModal(true);
    setIdToDelete(data.event.id);
  }

  function handleDelete() {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedEvent({
      title: "",
      start: "",
      message: "",
      isScheduled: false,
      allDay: false,
      id: "0",
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedEvent({
      ...selectedEvent,
      title: e.target.value,
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAllEvents([...allEvents, selectedEvent]);
    setShowModal(false);
    setSelectedEvent({
      title: "",
      start: "",
      message: "",
      isScheduled: false,
      allDay: false,
      id: "0",
    });
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
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleEventClick(data)}
              eventDrop={(data) => dropEvent(data)}
            />
          </div>
          <div
            id="draggable-el"
            className="ml-8 invisible md:visible  md:col-span-2 w-full border-2 p-2 rounded-md mt-16 h-2/3 bg-violet-50"
          >
            <h1 className="font-bold text-lg text-center">Drag Event</h1>
            <div className="flex flex-col justify-between h-full">
              <div className="overflow-y-auto overflow-x-hidden">
                {unscheduledEvents.map((event) => (
                  <div title={event.title} id={event.id} key={event.id}>
                    <button
                      className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white hover:cursor"
                      onClick={() => handleUnscheduledEventOnclick(event)}
                      title={event.title}
                      id={event.id}
                      key={event.id}
                    >
                      {event.title}
                    </button>
                  </div>
                ))}
              </div>
              <button className="mb-12 mt-3">Add Event</button>
            </div>
          </div>
        </div>
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent
            onInteractOutside={() => setShowDeleteModal(false)}
            className="sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
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
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
