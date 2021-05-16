import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Form, Button, Card, Image, Icon } from "semantic-ui-react";
import { useState } from "react";

function App() {
  // default pin
  // const defaultPin = "110001";
  // const defaultDate = "16-05-2021";
  const defaultPin = "";
  const defaultDate = "";
  // define states
  const api_base_url =
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin";
  const [pincodeInput, setPincodeInput] = useState(defaultPin);
  const [dateInput, setDateInput] = useState(defaultDate);
  const [data, setData] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchDone, setSearchDone] = useState(false);

  // function to handle changes to input columns
  function handleChange(event) {
    // console.log(event);
    var source = event.target.name;
    var value = event.target.value;
    if (source === "pincodeInput") {
      setPincodeInput(value);
    } else if (source === "dateInput") {
      var formatted_date = new Date(value);
      var date_string =
        formatted_date.getDate() +
        "-" +
        (formatted_date.getMonth() + 1) +
        "-" +
        formatted_date.getFullYear();
      console.log(date_string);
      setDateInput(date_string);
    } else if (source === "searchInput") {
      setSearchInput(value);
    }
  }

  // function to handle submit
  function handleSubmit() {
    const api_url =
      api_base_url + "?pincode=" + pincodeInput + "&date=" + dateInput;
    console.log(api_url);
    fetch(api_url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.centers);
        if (data.centers.length === 0) {
          console.log("No results");
          setNoResults(true);
        } else {
          setNoResults(false);
        }
        setData(data.centers);
      });
    setSearchInput("");
    setSearchDone(true);
  }

  function handleSearch() {
    console.log("Searching for hospitals matching - " + searchInput);
    const filtered_data = data.filter((center) => {
      return center.name.includes(searchInput);
    });
    console.log(filtered_data);
    setData(filtered_data);
  }

  return (
    <div className="App">
      <div className="header-nav-bar">COWIN</div>
      <div className="input-form">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Input
              onChange={handleChange}
              name="pincodeInput"
              placeholder="Pincode"
              width={3}
              value={pincodeInput}
              autofocus
            />
            <Form.Input
              onChange={handleChange}
              name="dateInput"
              type="date"
              // label="Date in dd-mm-yyyy format"
              placeholder="Date in dd-mm-yyyy format"
              width={3}
              value={dateInput}
            />
            {/* <Form.Input label='Last Name' placeholder='Last Name' width={6} /> */}
            <Button type="submit" className="submit-button">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </div>
      <hr></hr>
      <div className="search-form">
        {noResults ? null : searchDone ? (
          <Form onSubmit={handleSearch}>
            <Form.Group>
              <Form.Input
                onChange={handleChange}
                name="searchInput"
                placeholder="Search for hospital"
                width={8}
              />
              <Button type="submit" className="submit-button">
                Search
              </Button>
              <Button className="submit-button" onClick={handleSubmit}>
                Clear search
              </Button>
            </Form.Group>
          </Form>
        ) : null}
      </div>
      <div>
        {data.map((center_element) => {
          return (
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  <h1>{center_element.name}</h1>
                </Card.Header>
                <Card.Meta>
                  <span className="date">{center_element.address}</span>
                </Card.Meta>
                <Card.Description></Card.Description>
              </Card.Content>
              {center_element.sessions.map((sessions) => {
                return (
                  <Card.Content extra>
                    <h3>
                      Availability of {sessions.vaccine} on {sessions.date}
                    </h3>
                    Minimum Age Limit: {sessions.min_age_limit}
                    <p>
                      <strong>Dose 1:</strong>{" "}
                      {sessions.available_capacity_dose1}
                    </p>
                    <p>
                      <strong>Dose 2:</strong>{" "}
                      {sessions.available_capacity_dose2}
                    </p>
                  </Card.Content>
                );
              })}
            </Card>
          );
        })}
      </div>
      <div>{noResults ? <h3>No results found</h3> : null}</div>
    </div>
  );
}

export default App;
