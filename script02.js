document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const userIdInput = document.getElementById("userId");
  const nameInput = document.getElementById("name");
  const itsInput = document.getElementById("its");
  const fmbInput = document.getElementById("fmb");
  const oldSabeelInput = document.getElementById("oldsabeel");
  const newSabeelInput = document.getElementById("newsabeel");
  const dateInput = document.getElementById("date");
  const submitButton = document.getElementById("submitnow");
  const check = document.getElementById("check");
  const saveBtn = document.getElementById("saveBtn");
  const h5name = document.getElementById("h5name");
  const h5date = document.getElementById("h5date");
  const staticBackdropLabel = document.getElementById("staticBackdropLabel");
  const staticBackdrop = document.getElementById("staticBackdrop");
  const popup = document.getElementById("popup"); // Ensure popup is selected outside the loop
  
  // Form Data Object
  const formdata = {
    sabeelnumber: 0,
    name: "",
    date: "",
    time: "",
  };
  check.addEventListener("click", async () => {
    let userIdValue = Number(userIdInput.value);
    if (userIdInput.value.length === 4 && Number.isInteger(userIdValue) && userIdValue > 0) {
      try {
        const fetcheduser = await getUser(userIdValue); //call to db to check if user already exists.
        if (fetcheduser.length > 0) {
          // alert("coming here")
          staticBackdropLabel.innerText = "Found Appointment Details";
          const nextDay = new Date(new Date(fetcheduser[0].date).setDate(new Date(fetcheduser[0].date).getDate() + 1)).toISOString().split('T')[0];
          var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
          myModal.show();
          h5name.innerText = "NAME : " +fetcheduser[0].name.toUpperCase();
          h5date.innerText = "DATE : " +nextDay;
          if (fetcheduser[0].time === "21:00:00") {
            h5time.innerText = "TIME : " +"9:00:00 PM";
            return;
          }
          h5time.innerText = "TIME : " +fetcheduser[0].time.toUpperCase() + " AM";
          return;
        }
      } catch (error) {
        console.error("Error in getUserData:", error);
      }
      fetchData(userIdValue); // Pass userId, fetches details from excell.
      userIdInput.disabled = true; // Disable the userId field once the sabeel id is entered.
      check.disabled = true;
    } else {
      alert("Sabeel Number Invalid, Enter 4 digit Number");
      userIdInput.value = "";
      // location.reload();
    }
  });
  /*
  userIdInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          // Convert user input to a number
          let userIdValue = Number(userIdInput.value);
          
          // Sabeel ID Validation
          if (userIdInput.value.length === 4 && Number.isInteger(userIdValue) && userIdValue > 0) {
              fetchData(userIdValue); // Pass userId, fetches details from excell.
              userIdInput.disabled = true;  // Disable the userId field once the sabeel id is entered.
          } else {
              alert("Sabeel Number Invalid, Enter 4 digit Number");
              location.reload();
          }
      }
  });
  */

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    //take values from input form.
    const userid = userIdInput.value;
    const name = nameInput.value;
    const date = dateInput.value;
    const selectedRadio = document.querySelector(
      'input[name="timeSlot"]:checked'
    );

    if (!userid || !name || !date || !selectedRadio) {
      alert("Please Select Time.");
      return;
    }
    formdata.sabeelnumber = userid;
    formdata.name = name;
    formdata.date = date;
    formdata.time = selectedRadio.value;

    postdata(formdata);
    //  sendData();
  });

  dateInput.addEventListener("change", async (event) => {
    const selectedDate = event.target.value;
    const slotshere = await checkSlots(selectedDate);
    // You can log or use slotshere if needed
  });

  saveBtn.addEventListener("click", takeScreenshot);

  // Function to fetch data from Google Sheets
  async function fetchData(userId) {
    const url = `https://badrimohalla.onrender.com/noc/${userId}`;

    try {
      // alert(`Please wait while checking for Sabeel number: ${userId}`);
      const response = await fetch(url);

      if (response.status === 404) {
        alert("Sabeel ID not available. Please contact the Jumat Office.");
        //   userIdInput.value = "";
        location.reload();
        return;
      }

      if (!response.ok)
        throw new Error(`Error occurred: ${response.statusText}`);

      const userData = await response.json();

      nameInput.value = userData.c[1].v;
      itsInput.value = userData.c[2].v;
      fmbInput.value = userData.c[3].v;
      oldSabeelInput.value = userData.c[4].v;
      newSabeelInput.value = userData.c[5].v;

      // alert("Name found. Please select date and time.");
      dateInput.disabled = false;

      // document.querySelectorAll('input[name="timeSlot"][type="radio"]').forEach(radio => radio.disabled = false);
    } catch (error) {
      alert("Something went wrong. Please try again later.");
      console.error("Error details:", error);
    }
  }

  /*
      // Function to check slot availability
      async function checkSlots(selectedDate) {
        const url = `https://badrimohalla.onrender.com/slots/${selectedDate}`;
        
        try {
          const response = await fetch(url);
          const slotData = await response.json();
    
          let isAnySlotAvailable = false;
          slotData.forEach((slot, index) => {
            // console.log(slot.available);
            const radioButton = document.querySelector(`input[id="slot${index + 1}"][type="radio"]`);
            const slotLabel = document.querySelector(`label[for="slot${index + 1}"]`);
                
  
            // const text = slotLabel.getAttribute('data-popup');
              popup.textContent = slot.available;
              popup.style.display = 'block';
  
              const rect = slotLabel.getBoundingClientRect();
              popup.style.top = `${rect.top - 40}px`; // Adjust to show above
              popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2}px`; // Centered above the label
  
  
  
            radioButton.disabled = !slot.is_available;  //make it true only if slots are available
            
            // slotLabel.textContent = slotLabel.textContent+ `${slot.available} Available`; //show count
  
            if (slot.is_available) isAnySlotAvailable = true;
          });
    
          submitButton.disabled = !isAnySlotAvailable;
    
          if (!isAnySlotAvailable) alert("No seats available. Kindly select another date.");
    
          return slotData;
    
        } catch (error) {
          console.error("Error fetching slots:", error);
          alert("Error fetching slot data. Please try again later.");
        }
      }
  */

  async function checkSlots(selectedDate) {
    const url = `https://badrimohalla.onrender.com/slots/${selectedDate}`;

    try {
      const response = await fetch(url);
      const slotData = await response.json(); //slotData contains all slot values.
      console.log(slotData);

      let isAnySlotAvailable = false;

      slotData.forEach((slot, index) => {
        const radioButton = document.querySelector(
          `input[id="slot${index + 1}"][type="radio"]`
        );
        const slotLabel = document.querySelector(
          `label[for="slot${index + 1}"]`
        );

        // Enable/Disable the radio button based on availability
        radioButton.disabled = !slot.is_available;

        // Handle pop-up display for available slots when mouse enters the radio button
        const showPopup = function () {
          // if (slot.is_available) { // Only show pop-up for available slots
          // popup.textContent = `${slot.available ? 'Available' : 'Not Available'}`;
          popup.textContent = slot.available + " Available";
          popup.style.display = "block";

          const rect = slotLabel.getBoundingClientRect();
          popup.style.top = `${rect.top - 40}px`; // Position above the label
          popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2
            }px`; // Center above the label
          // }
        };

        // Handle mouse leave event to hide the pop-up
        const hidePopup = function () {
          popup.style.display = "none"; // Hide the pop-up when the mouse leaves the radio button or label
        };

        // Add event listeners for both radio buttons and their associated labels
        // radioButton.addEventListener('mouseenter', showPopup);
        slotLabel.addEventListener("mouseenter", showPopup);

        // radioButton.addEventListener('mouseleave', hidePopup);
        slotLabel.addEventListener("mouseleave", hidePopup);

        // If any slot is available, enable the submit button
        if (slot.is_available) {
          isAnySlotAvailable = true;
        }
      });

      const submitButton = document.getElementById("submitnow");
      submitButton.disabled = !isAnySlotAvailable;

      if (!isAnySlotAvailable)
        alert("No seats available. Kindly select another date.");

      return slotData;
    } catch (error) {
      console.error("Error fetching slots:", error);
      alert("Error fetching slot data. Please try again later.");
    }
  }

  // Function to post data to DB
  async function postdata(formdata) {
    const url = "https://badrimohalla.onrender.com/send";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      const data = await response.json();
      // alert(data.sabeelnumber);
      var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
      myModal.show();
      h5name.innerText = formdata.name.toUpperCase();
      h5date.innerText = formdata.date.toUpperCase();
      if (formdata.time === "21:00:00") {
        h5time.innerText = "9:00:00 PM";
        return;
      }
      h5time.innerText = formdata.time.toUpperCase();
      //   location.reload();
    } catch (error) {
      console.error("Error: printing here: ", error);
      alert(error.message);
      location.reload();
    }
  }

  async function getUser(userid) {
    const url = `https://badrimohalla.onrender.com/user/${userid}`;

    try {
      const response = await fetch(url);

      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json(); // Assuming this returns the user object

      // Check if user data exists
      if (!user) {
        throw new Error("No user found.");
      }

      return user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Error fetching user data. Please try again later.");
    }
  }

  function takeScreenshot() {
    // Select the element to capture (in this case, the div with id 'content')
    const content = staticBackdrop;

    // Use html2canvas to take a screenshot of the content
    html2canvas(content, {
      onrendered: function (canvas) {
        // This is the callback-based version for older versions
        // Convert the canvas to an image
        const imgData = canvas.toDataURL("image/png");
        // Create an image element to display the screenshot
        const imgElement = document.createElement("img");
        imgElement.src = imgData;
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "screenshot.png";
        link.click();
      },
    });
  }
});
