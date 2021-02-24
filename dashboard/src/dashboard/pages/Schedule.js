import React, { useState, useEffect, useRef } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Badge, Button, Modal, Table } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../../utils/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import InputSelect from "../components/InputSelect";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const Schedule = (props) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [onCallUser, setOnCallUser] = useState(null);

  // Override
  const [showOverride, setShowOverride] = useState(false);
  const [overrideStartDate, setOverrideStartDate] = useState(new Date());
  const [overrideEndDate, setOverrideEndDate] = useState(new Date());
  const [overrideDateError, setOverrideDateError] = useState(` `);
  const [overrideUser, setOverrideUser] = useState(null);
  const [overrideData, setOverrideData] = useState({});
  const [overrideRaw, setOverrideRaw] = useState([]);
  const [override, setOverride] = useState(null);
  const [showOverrideDelete, setShowOverrideDelete] = useState(null);

  const calendarRef = useRef(null);
  const { currentUser } = props;

  const fetchUsers = async () => {
    const { data = null, error = null } = await api(
      "/api/org_user/?ordering=created_on",
      "GET",
      {}
    );

    if (data) {
      const users = data.results.filter((u) => {
        return u.is_oncall && u.schedule;
      });

      users.sort((a, b) =>
        a.schedule.order > b.schedule.order
          ? 1
          : b.schedule.order > a.schedule.order
          ? -1
          : 0
      );

      getOnCallUser();

      setUsers(users);
      setLoading(false);
      getOverrides(users);
    }

    if (error) {
      alert("Something went wrong!");
    }
  };

  const getOnCallUser = async () => {
    const { data = null } = await api("/api/org_user/get_on_call_user");
    setOnCallUser(data);
  };

  const getOverrides = async (users) => {
    const start = moment(new Date()).format("YYYY-MM-DD");

    const { data = null, error = null } = await api(
      `schedule_override/?start_date__gte=${start} 00:00:00`
    );

    if (data) {
      setOverrideRaw(data.results);
      const overrides = {};

      for (let i = 0; i < data.results.length; i++) {
        const d = data.results[i];
        const start = moment.utc(d.start_date);
        const end = moment.utc(d.end_date);

        let current = start;
        while (current <= end) {
          overrides[current.format("YYYY-MM-DD")] = {
            user: d.org_user,
            id: d.id,
          };
          current = current.add(1, "days");
        }
      }

      setOverrideData(overrides);
      generateCalendarEvents(users, overrides);
    }

    if (error) {
      alert("Something went wrong when getting overrides");
    }
  };

  const generateCalendarEvents = (users, overrides) => {
    const newEvents = [];

    let week = currentUser.role.org.week;

    let start = new Date();
    while (start.getDate() > 1) {
      start = new Date(start.setDate(start.getDate() - 1));
      if (start.getDay() === 1) {
        week = week - 1;
        if (week === 0) {
          week = users.length;
        }
      }
    }

    let calDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    let curUser = users[week - 1];
    // Generate Future Events
    for (let i = 0; i < 365; i++) {
      let day = `${calDate.getDate()}`;
      let month = `${calDate.getMonth() + 1}`;

      const overrideDate = moment(calDate).format("YYYY-MM-DD");

      if (day.length === 1) {
        day = `0${day}`;
      }
      if (month.length === 1) {
        month = `0${month}`;
      }

      let onCallUser = curUser;
      let overrideText = "";
      let overrideId = null;

      if (overrides[overrideDate]) {
        const o = overrides[overrideDate].user;
        overrideId = overrides[overrideDate].id;
        for (let j = 0; j < users.length; j++) {
          if (users[j].id === o) {
            onCallUser = users[j];
            overrideText = " (o)";
          }
        }
      }

      newEvents.push({
        title: `${onCallUser.first_name} ${onCallUser.last_name} ${overrideText}`,
        date: `${calDate.getFullYear()}-${month}-${day}`,
        color: onCallUser.color,
        overrideId: overrideId,
      });
      calDate = new Date(calDate.setDate(calDate.getDate() + 1));

      if (calDate.getDay() === 1) {
        week++;
        if (week > users.length) {
          week = 1;
        }

        curUser = users[week - 1];
      }
    }

    setEvents(newEvents);
  };

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line
  }, [refresh]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    for (let i = 0; i < result.length; i++) {
      const r = result[i];
      r.order = i + 1;
    }

    setUsers(result);
    setShowSave(true);
  };

  const handleSaveSchedule = async () => {
    const newOnCallUser = users[currentUser.role.org.week - 1];

    let doUpdate = true;
    let sendNotifications = false;
    if (newOnCallUser.id !== onCallUser.id) {
      doUpdate = window.confirm(
        `Your new schedule may result in having a different on-call user this week.\n\nDo you wish to continue?`
      );
      sendNotifications = true;
    }

    if (doUpdate) {
      for (let i = 0; i < users.length; i++) {
        const usr = users[i];
        await api("/api/org_user/update_user_order", "POST", {
          user_id: usr.id,
          new_index: usr.order,
        });
      }
      setRefresh(refresh + 1);
      setShowSave(false);

      if (sendNotifications) {
        const { data = null } = await api("/api/org_user/get_on_call_user");

        setOnCallUser(data);

        await api("/api/org_user/send_notification_update", "POST", {
          offcall_id: onCallUser.id,
          oncall_id: data.id,
        });
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    reorder(users, result.source.index, result.destination.index);
  };

  const getItemStyle = (isDragging, draggableStyle, item) => ({
    userSelect: "none",
    padding: "5px",
    margin: "0 0 5px 0",
    borderRadius: "5px",
    backgroundColor: isDragging ? "#ccc" : item.color,
    color: "#FFF",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const evClick = ({ event, jsEvent }) => {
    if (!users || users.length < 2) {
      return;
    }

    if (event.start < new Date()) {
      alert("You cannot override a date from the past");
      return;
    }
    const thisDate = moment.utc(event.start).format("YYYY-MM-DD");

    if (overrideData[thisDate]) {
      for (let i = 0; i < overrideRaw.length; i++) {
        if (overrideRaw[i].id === event.extendedProps.overrideId) {
          setOverride(overrideRaw[i]);
          setShowOverrideDelete(true);
        }
      }
      return;
    }

    document.activeElement.blur();
    jsEvent.target.focus();
    setOverrideUser(users[0].id);
    setOverrideStartDate(event.start);
    setOverrideEndDate(event.start);
    setShowOverride(true);
    setOverrideDateError("");
  };

  const setOverrideDate = (dt, date) => {
    let isError = false;
    if (dt === "start") {
      setOverrideStartDate(date);

      if (date > overrideEndDate) {
        isError = true;
      }
    } else {
      setOverrideEndDate(date);

      if (overrideStartDate > date) {
        isError = true;
      }
    }

    if (!isError && date < new Date()) {
      isError = true;
    }

    if (isError) {
      setOverrideDateError(
        "Dates must be bigger than today and end date must be larger than to the start date"
      );
    } else {
      setOverrideDateError("");
    }
  };

  const showOverrideModal = () => {
    setOverrideUser(users[0].id);
    setOverrideStartDate(new Date());
    setOverrideEndDate(new Date());
    setShowOverride(true);
    setOverrideDateError("");
  };

  const saveOverride = async () => {
    const payload = {
      org: props.currentUser.role.org.id,
      org_user: overrideUser,
      start_date: `${moment(overrideStartDate).format("YYYY-MM-DD")} 00:00:00`,
      end_date: `${moment(overrideEndDate).format("YYYY-MM-DD")} 23:59:59`,
    };

    const { data = null, error = null } = await api(
      `schedule_override/`,
      "POST",
      payload
    );

    if (data) {
      setShowOverride(false);
      setRefresh(refresh + 1);
    }

    if (error) {
      alert("Something went wrong saving your override");
    }
  };

  const deleteOverride = async () => {
    await api(`schedule_override/${override.id}/`, "DELETE");

    setShowOverrideDelete(false);
    setOverride(null);
    setRefresh(refresh + 1);
  };

  return (
    <Body title="Schedule" selectedMenu="schedule" loading={loading} {...props}>
      <Card>
        <Card.Body>
          <Row>
            <Col xs={12} lg={3}>
              <Card.Title>
                <Row>
                  <Col>On Call Schedule</Col>
                  <Col className="text-right">
                    <Badge pill variant="light">
                      <>
                        <span>Current Week </span>
                        <span className="form-label">
                          {currentUser.role.org.week}
                        </span>
                      </>
                    </Badge>
                  </Col>
                </Row>
              </Card.Title>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="mt-4"
                    >
                      {users.map((item, index) => (
                        <Draggable
                          key={index}
                          draggableId={`user-${index}`}
                          index={index}
                          isDragDisabled={currentUser.role.role !== "admin"}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                item
                              )}
                            >
                              {item.first_name} {item.last_name}
                              {item.schedule.order === item.org.week ? (
                                <span
                                  className="pl-2"
                                  role="img"
                                  aria-label="is-on-call"
                                >
                                  📱
                                </span>
                              ) : null}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {showSave && (
                <Row className="mt-3 mb-3">
                  <Col>
                    <Button
                      type="custom"
                      className="btn btn-block btn-primary"
                      onClick={() => handleSaveSchedule()}
                    >
                      Save Schedule
                    </Button>
                  </Col>
                </Row>
              )}

              <Card.Subtitle className="mt-4">
                This view displays your on-call schedule. You may drag and drop
                your team members up and down to change the order of the
                schedule.
              </Card.Subtitle>
            </Col>
            <Col className="hide-small">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                eventClick={evClick}
                events={events}
                customButtons={{
                  createOverride: {
                    text: "+ Override",
                    click: () => showOverrideModal(),
                  },
                }}
                headerToolbar={{
                  right: "prev,next today createOverride",
                  center: "title",
                }}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal
        show={showOverrideDelete}
        onHide={() => setShowOverrideDelete(false)}
        aria-labelledby="override-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="override-modal">Delete the override</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>You are about to override the following override</Col>
          </Row>
          {override && (
            <Table borderless size="sm">
              <tr>
                <td>
                  <strong>Start Date: </strong>
                </td>
                <td>{moment.utc(override.start_date).format("LLL")}</td>
              </tr>
              <tr>
                <td>
                  <strong>End Date: </strong>
                </td>
                <td>{moment.utc(override.end_date).format("LLL")}</td>
              </tr>
              <tr>
                <td>
                  <strong>Team Member: </strong>
                </td>
                <td>
                  {
                    users.filter((u) => u.id === override.org_user)[0]
                      .first_name
                  }{" "}
                  {users.filter((u) => u.id === override.org_user)[0].last_name}
                </td>
              </tr>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowOverrideDelete(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => deleteOverride()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showOverride}
        onHide={() => setShowOverride(false)}
        aria-labelledby="override-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="override-modal">Override Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputSelect
            id="override"
            label="Who will be overriding the schedule?"
            helperText="Select the user who will be override the schedule"
            showDefault={false}
            values={users.map((u, i) => ({
              value: u.id,
              text: `${u.first_name} ${u.last_name}`,
            }))}
            onChange={(e) => setOverrideUser(parseInt(e.target.value))}
          />

          <div className="form-group mt-3">
            <label className="form-label">
              Which dates do you want to override?
            </label>
          </div>
          <Row noGutters>
            <Col xs={12} lg={6}>
              <p className="mb-0 ml-0">Start Date</p>
            </Col>
            <Col xs={12} lg={6}>
              <p className="mb-0  ml-2">End Date</p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={6}>
              <DatePicker
                selected={overrideStartDate}
                onChange={(date) => setOverrideDate("start", date)}
                className="form-control"
              />
            </Col>
            <Col xs={12} lg={6}>
              <DatePicker
                selected={overrideEndDate}
                onChange={(date) => setOverrideDate("end", date)}
                className="form-control"
              />
            </Col>
          </Row>
          <Row>
            <Col className="ml-1">
              <span className="text-danger">
                <small>{overrideDateError}</small>
              </span>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOverride(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => saveOverride(false)}
            disabled={overrideDateError.length > 0}
          >
            Override
          </Button>
        </Modal.Footer>
      </Modal>
    </Body>
  );
};

export default Schedule;
